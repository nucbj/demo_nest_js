/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase';

import { ResultInfoDto } from './model/dto/resultInfoDto';
import { IssueParameter } from './model/parameter/issueParameter';

import { UnExpectedException } from 'src/exception/UnExpectedException';

@Injectable()
export class DomainService {
  constructor(private readonly fireBaseService: FirebaseService) {}

  // async getInfos(): Promise<InfoDto[]> {
  //   return this.fireBaseService.getInfos();
  // }
  // async getInfos(): Promise<InfoDto[]> {
  //   return this.fireBaseService.getInfos();
  // }

  // async getInfo(name: string): Promise<InfoDto> {
  //   console.log(name);
  //   return this.fireBaseService.getInfo(name);
  // }

  // async getInfoByRegionName(region: string): Promise<InfoDto> {
  //   return this.fireBaseService.getInfoByRegionName(region);
  // }

  async findInfo(code: string, name: string): Promise<ResultInfoDto> {
    return this.fireBaseService.findAndIncrementSearchCount(code, name);
  }

  async incrementScandalCount(info: IssueParameter): Promise<ResultInfoDto> {
    return this.fireBaseService.incrementScandalCount(info);
  }

  async findRank(_searchType: string, _page: number): Promise<any> {
    const dto = await this.fireBaseService.findRank(_searchType, _page);
    if (_searchType === 'scandal') {
      return dto.scandalCount;
    } else if (_searchType === 'search') {
      return dto.searchCount;
    } else {
      throw new UnExpectedException('searchType is not valid');
    }
  }
}
