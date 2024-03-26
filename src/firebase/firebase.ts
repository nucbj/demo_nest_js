/* eslint-disable prettier/prettier */
// firebase.service.ts
import { Injectable } from '@nestjs/common';
import { DocumentData, Firestore } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';

import { IssueParameter } from 'src/domain/model/parameter/issueParameter';

import { RankInfoDto } from 'src/domain/model/dto/rankInfoDto';
import { ResultInfoDto } from 'src/domain/model/dto/resultInfoDto';

import { ScandalVo } from 'src/domain/model/vo/scandalVo';
import { SearchVo } from 'src/domain/model/vo/searchVo';
import { InfoEntity } from 'src/entity/InfoEntity';

import { NoSuchElementException } from 'src/exception/NoSuchElementException';
import { UnExpectedException } from 'src/exception/UnExpectedException';

@Injectable()
export class FirebaseService {
  private collection: admin.firestore.CollectionReference<
    admin.firestore.DocumentData,
    admin.firestore.DocumentData
  >;

  constructor(private readonly configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('PROJECT_ID'),
        clientEmail: this.configService.get<string>('CLIENT_EMAIL'),
        privateKey: this.configService.get<string>('PRIVATE_KEY').replace(/\\n/g, '\n'),
      }),
    });
    this.firestore = admin.firestore();
    this.collection = this.firestore.collection('scandal');
  }

  private firestore: Firestore;

  async findInfo(code: string, name: string): Promise<ResultInfoDto> {
    const snapshot = await this.selectCollection(code, name);

    if (snapshot == null) {
      throw new UnExpectedException('snapshot is null');
    } else {
      const scandalCountRank: InfoEntity[] = snapshot.docs.map(doc => {
        return new InfoEntity(
          doc.data().region1Code,
          doc.data().region2Code,
          doc.data().region3Code,
          doc.data().code,
          doc.data().scandalCount,
          doc.data().regionFullName,
          doc.data().name,
          doc.data().searchCount,
          doc.data().category,
        );
      });
      return this.merged(scandalCountRank).find(item => item.name === name);
    }
  }

  async findRank(_searchType: string, _page: number): Promise<RankInfoDto> {
    const contentsSize = 20;

    const collection = this.collection.select(
      'region1Code',
      'region2Code',
      'region3Code',
      'code',
      'scandalCount',
      'regionFullName',
      'name',
      'searchCount',
      'category',
    );

    let _typeCount;

    if (_searchType === 'search') {
      _typeCount = collection
        .limit(contentsSize * _page)
        .orderBy('scandalCount', 'desc')
        .get();
    } else {
      // _searchType === 'scandal'
      _typeCount = collection
        .limit(contentsSize * _page)
        .orderBy('searchCount', 'desc')
        .get();
    }

    const _countRank: InfoEntity[] = (await _typeCount).docs.map(doc => {
      return new InfoEntity(
        doc.data().region1Code,
        doc.data().region2Code,
        doc.data().region3Code,
        doc.data().code,
        doc.data().scandalCount,
        doc.data().regionFullName,
        doc.data().name,
        doc.data().searchCount,
        doc.data().category,
      );
    });
    const mergedRank = this.merged(_countRank);
    return new RankInfoDto(
      mergedRank
        .map(item => {
          return new ScandalVo(item.regionFullName, item.scandalCount);
        })
        .sort((a, b) => b.scandalCount - a.scandalCount),
      mergedRank
        .map(item => {
          return new SearchVo(item.regionFullName, item.searchCount);
        })
        .sort((a, b) => b.searchCount - a.searchCount),
    );
  }

  async findAndIncrementSearchCount(code: string, name: string): Promise<ResultInfoDto> {
    const snapshot = await this.selectCollection(code, name);
    if (snapshot == null) {
      await this.addNewInfo({ code, name, category: 'realEstate' }, 0, 1);
    } else {
      await this.incrementExistingCount(snapshot, 'searchCount');
    }
    return await this.findInfo(this.convertRegax(code), name);
  }

  async incrementScandalCount(info: IssueParameter): Promise<ResultInfoDto> {
    const snapshot = await this.selectCollection(info.code, info.name);

    if (snapshot == null) {
      // !! 이슈 스캔들 시 기존 도큐먼트가 없을 경우 증량하지 않는다.
      // await this.addNewInfo(info, 1, 0);
      throw new NoSuchElementException(`code: ${info.code}, name: ${info.name}`);
    } else {
      await this.incrementExistingCount(snapshot, 'scandalCount');
    }
    return await this.findInfo(this.convertRegax(info.code), info.name);
  }

  async addNewInfo(info: IssueParameter, scandalCount: number, searchCount: number): Promise<void> {
    // !! REF https://github.com/kr-juso/administrationCode/blob/main/administrationCode.tsv
    const tsvFileData = readFileSync('src/resource/administrationCode.tsv');
    const jsonRes = this.tsvJSON(tsvFileData.toString());
    const item = jsonRes.find(item => item['행정동코드'] === info.code);

    if (item) {
      const data = new InfoEntity(
        info.code.slice(0, 2),
        info.code.slice(0, 5),
        this.convertRegax(info.code).length > 5 ? info.code.slice(0, 8) : null,
        info.code,
        scandalCount,
        this.convertRegax(info.code).length > 5
          ? `${item['시도명']} ${item['시군구명']} ${item['읍면동명']}`
          : `${item['시도명']} ${item['시군구명']}`,
        info.name,
        searchCount,
        info.category,
      );

      await this.collection.add(data.toObject());
    }
  }

  async incrementExistingCount(
    snapshot: admin.firestore.QuerySnapshot,
    field: string,
  ): Promise<void> {
    const updatePromises = snapshot.docs.map(doc =>
      this.collection.doc(doc.id).update({
        [field]: admin.firestore.FieldValue.increment(1),
      }),
    );

    await Promise.all(updatePromises);
  }

  merged(
    data: {
      scandalCount: number;
      regionFullName: string;
      searchCount: number;
      region2Code: string;
    }[],
  ): ResultInfoDto[] {
    const combinedData = data.reduce((acc, cur) => {
      const found = acc.find(item => item.region2Code === cur.region2Code);

      if (found) {
        found.scandalCount += cur.scandalCount;
        found.searchCount += cur.searchCount;
      } else {
        acc.push({ ...cur });
      }

      return acc;
    }, []);

    return combinedData.map(item => {
      return new ResultInfoDto(item);
    });
  }

  async selectCollection(
    code: string,
    name: string,
  ): Promise<FirebaseFirestore.QuerySnapshot<DocumentData> | null> {
    const query =
      code.length > 5
        ? this.collection.where('code', '==', `${code}`)
        : this.collection.where('region2Code', '==', `${code}`);

    const snapshot = await query.where('name', '==', `${name}`).get();

    if (snapshot.empty) {
      // throw new NoSuchElementException(`code: ${code}, name: ${name}`);
      console.log('No matching documents.');
      return null;
    }

    return snapshot;
  }

  tsvJSON(tsv): any[] {
    const lines = tsv.split('\n');
    const result = [];
    const headers = lines[0].split('\t');

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split('\t');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
  }

  convertRegax(code: string): string {
    return code.replace(/00000$/, '');
  }

  // !! Issue :: 키워드 부분 조건 검색이 불가함
  // !! 서울특별시 은평구 -> 가능
  // !! 서울특별시 은평구 응암동 -> 가능
  // !! 은평구 -> 불가 / 은평구 응암동 -> 불가
  // !! Algolia 혹은 ElasticSearch를 사용하여 검색 기능을 추가해야함
  // async getInfoByRegionName(region: string): Promise<InfoDto> {
  //   const startAtName = region;
  //   const endAtName = region + '\uf8ff';
  //   const snapshot = await this.collection
  //     .where('code', '>=', startAtName)
  //     .where('code', '<=', endAtName)
  //     .get();
  //   // const usaOrJapan = await collection
  //   // .where('regionFullName', 'in or not-in', ['서울', '응암'])
  //   // .get();
  //   if (snapshot == null) {
  //     console.log('No matching documents.');
  //     return null;
  //   }

  //   snapshot.docs.forEach((doc) => {
  //     console.log(doc.data());
  //   });

  //   const doc = snapshot.docs[0];
  //   return doc.data() as InfoDto;
  // }
}

// {
//   "region1Code": "11",
//   "region2Code": "11380",
//   "region3Code": "11380107",
//   "code": "1138010700",
//   "scandalCount": 1,
//   "regionFullName": "서울특별시 구로구 신도림동",
//   "name": "김진호",
//   "searchCount": 0,
//   "category": "realEstate"
// }
