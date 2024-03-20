/* eslint-disable prettier/prettier */
// firebase.service.ts


import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';

import { RankInfoDto } from 'src/domain/model/dto/rankInfoDto';
import { InfoDto } from 'src/entity/InfoDto';

import { ConfigService } from '@nestjs/config';


@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {

    console.log(this.configService.get<string>('PROJECT_ID'));
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('PROJECT_ID'),
        clientEmail: this.configService.get<string>('CLIENT_EMAIL'),
        privateKey: this.configService.get<string>('PRIVATE_KEY').replace(/\\n/g, '\n'),
      }),
    });

    this.firestore = admin.firestore();
  }

  private firestore: Firestore;

  async getInfos(): Promise<InfoDto[]> {
    const document = this.firestore.collection('scandal');
    const result = [];
    const snapshot = await document.get();
    snapshot.docs.forEach((doc) => {
      result.push(doc.data());
    });
    return result;
  }

  async getInfo(name: string): Promise<InfoDto> {
    const collection = this.firestore.collection('scandal');
    const snapshot = await collection.where('name', '==', `${name}`).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return null;
    }
    const doc = snapshot.docs[0];
    return doc.data() as InfoDto;
  }

  // !! Issue :: 키워드 부분 조건 검색이 불가함
  // !! 서울특별시 은평구 -> 가능
  // !! 서울특별시 은평구 응암동 -> 가능
  // !! 은평구 -> 불가 / 은평구 응암동 -> 불가
  // !! Algolia 혹은 ElasticSearch를 사용하여 검색 기능을 추가해야함
  async getInfoByRegionName(region: string): Promise<InfoDto> {
    const collection = this.firestore.collection('scandal');
    const startAtName = region;
    const endAtName = region + '\uf8ff';
    const snapshot = await collection
      .where('regionFullName', '>=', startAtName)
      .where('regionFullName', '<=', endAtName)
      .get();
    // const usaOrJapan = await collection
    // .where('regionFullName', 'in or not-in', ['서울', '응암'])
    // .get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return null;
    }
    const doc = snapshot.docs[0];
    return doc.data() as InfoDto;
  }
  
  async getInfosRanking(): Promise<RankInfoDto> {
    const collection = this.firestore.collection('scandal');
    const snapshot = collection
      .orderBy('scandalCount', 'desc')
      .limit(10)
      .get();
      
    const snapshot1 = collection
      .orderBy('searchCount', 'desc')
      .limit(10)
      .get();

      const abc = collection.select('regionFullName', 'scandalCount', 'searchCount');
      const scandalCount = abc.orderBy('scandalCount', 'desc').get();
      const searchCount = abc.orderBy('searchCount', 'desc').get();
      const scandalCountRank: InfoDto[] = (await scandalCount).docs.map((doc) => {
        return {
          region3Code: doc.data().region3Code,
          code: doc.data().code,
          region2Code: doc.data().region2Code,
          scandalCount: doc.data().scandalCount,
          regionFullName: doc.data().regionFullName,
          name: doc.data().name,
          searchCount: doc.data().searchCount,
          region1Code: doc.data().region1Code,
          category: doc.data().category,
        };
      });

    const searchCountRank: InfoDto[] = (await searchCount).docs.map((doc) => {
      return {
        region3Code: doc.data().region3Code,
        code: doc.data().code,
        region2Code: doc.data().region2Code,
        scandalCount: doc.data().scandalCount,
        regionFullName: doc.data().regionFullName,
        name: doc.data().name,
        searchCount: doc.data().searchCount,
        region1Code: doc.data().region1Code,
        category: doc.data().category,
      };
    });

    const scandalRank: InfoDto[] = (await snapshot).docs.map((doc) => {
      return {
        region3Code: doc.data().region3Code,
        code: doc.data().code,
        region2Code: doc.data().region2Code,
        scandalCount: doc.data().scandalCount,
        regionFullName: doc.data().regionFullName,
        name: doc.data().name,
        searchCount: doc.data().searchCount,
        region1Code: doc.data().region1Code,
        category: doc.data().category,
      };
    });

    const searchRank: InfoDto[] = (await snapshot1).docs.map((doc) => {
      return {
        region3Code: doc.data().region3Code,
        code: doc.data().code,
        region2Code: doc.data().region2Code,
        scandalCount: doc.data().scandalCount,
        regionFullName: doc.data().regionFullName,
        name: doc.data().name,
        searchCount: doc.data().searchCount,
        region1Code: doc.data().region1Code,
        category: doc.data().category,
      };
    });
    return new RankInfoDto(this.merged(scandalCountRank), this.merged(searchCountRank), scandalRank, searchRank);
  }

  async makeInfo(info: InfoDto): Promise<InfoDto> {
    const collection = this.firestore.collection('scandal');
    // name과 regionFullName이 같은 데이터가 있는지 확인
    collection
      .where('name', '==', `${info.name}`)
      .where('regionFullName', '==', `${info.regionFullName}`).get().then((snapshot) => {
        console.log(snapshot)
      if (snapshot.empty) {
        collection.add(info);
      } else {
        // 있을 경우 scandalCount +1
        snapshot.docs.forEach((doc) => {
          collection.doc(doc.id).update({
            searchCount: admin.firestore.FieldValue.increment(1),
            scandalCount: admin.firestore.FieldValue.increment(1),
          });
        });
      }
    });
    return info
  }
  merged(data: { scandalCount: number, regionFullName: string, searchCount: number }[]): InfoDto[] {
    // regionFullName의 길이에 따라 데이터를 정렬합니다.
    data.sort((a, b) => a.regionFullName.length - b.regionFullName.length);

    const combinedData = data.reduce((acc, cur) => {
    const region = cur.regionFullName.split(' ').slice(0, 3).join(' ');
    const found = acc.find((item) => region.includes(item.regionFullName));

    if (found) {
    found.scandalCount += cur.scandalCount;
    found.searchCount += cur.searchCount;
    } else {
    acc.push({ ...cur, regionFullName: region });
    }

    return acc;
    }, []);

    combinedData.sort((a, b) => b.scandalCount - a.scandalCount);

    return combinedData;
  }
}