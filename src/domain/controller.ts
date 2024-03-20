import { Body, Controller, Get, Param, Put, UseFilters } from '@nestjs/common';
import { DomainService } from './service';

import { ExceptionHandler } from 'src/conf/ExceptionHandler';

import { RankInfoDto } from 'src/domain/model/dto/rankInfoDto';
import { InfoDto } from 'src/entity/InfoDto';

import { NullPointerException } from 'src/exception/NullPointerException';

@UseFilters(new ExceptionHandler())
@Controller('info')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get()
  async getInfos(): Promise<InfoDto[]> {
    return await this.domainService.getInfos();
  }

  // pathVariable
  @Get('/name/:name')
  async getInfo(@Param('name') name: string): Promise<InfoDto> {
    return await this.domainService.getInfo(name);
  }

  @Get('/region/:region')
  async getInfoByRegionName(@Param('region') region: string): Promise<InfoDto> {
    return await this.domainService.getInfoByRegionName(region);
  }

  @Get('/rank')
  async getInfosRanking(): Promise<RankInfoDto> {
    return await this.domainService.getInfosRanking();
  }

  @Put()
  async makeInfo(@Body() info: InfoDto): Promise<InfoDto> {
    const fieldsToCheck = ['name', 'region1Code', 'region2Code', 'region3Code'];

    for (const field of fieldsToCheck) {
      if (!info[field]) {
        throw new NullPointerException(`[[${field}]] is null or undefined`);
      }
    }

    return await this.domainService.makeInfo(info);
  }
}
