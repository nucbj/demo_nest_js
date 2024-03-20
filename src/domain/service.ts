/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase';

import { RankInfoDto } from 'src/domain/model/dto/rankInfoDto';
import { InfoDto } from 'src/entity/InfoDto';

@Injectable()
export class DomainService {
  
  constructor(private readonly fireBaseService: FirebaseService) {}

  async getInfos(): Promise<InfoDto[]> {
    return this.fireBaseService.getInfos();
  }

  async getInfo(name: string): Promise<InfoDto> {
    console.log(name);
    return this.fireBaseService.getInfo(name);
  }

  async getInfoByRegionName(region: string): Promise<InfoDto> {
    return this.fireBaseService.getInfoByRegionName(region);
  }

  async getInfosRanking(): Promise<RankInfoDto> {
    return this.fireBaseService.getInfosRanking();
  }

  async makeInfo(info: InfoDto): Promise<InfoDto> {
    return this.fireBaseService.makeInfo(info);
  }
}
