import { Body, Controller, Get, Param, Patch, Query, UseFilters } from '@nestjs/common';
import { DomainService } from './service';

import { ExceptionHandler } from 'src/conf/exception/exceptionHandler';

import { ResultInfoDto } from './model/dto/resultInfoDto';

import { NullPointerException } from 'src/exception/NullPointerException';
import { InvalidParamterException } from 'src/exception/InvalidParameter';
import { IssueParameter } from './model/parameter/issueParameter';
import { CommonResponse } from 'src/common/response/commonResponse';
import { ResponseCodeEnums } from 'src/common/enums/responseCodeEnums';

@UseFilters(new ExceptionHandler())
@Controller('info')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  // !! 전체 Info 검색
  // @Get()
  // async getInfos(): Promise<InfoDto[]> {
  //   return await this.domainService.getInfos();
  // }

  // !! 이름검색
  // pathVariable
  // @Get('/name/:name')
  // async getInfo(@Param('name') name: string): Promise<InfoDto> {
  //   return await this.domainService.getInfo(name);
  // }

  // !! 지역검색
  // @Get('/region/:region')
  // async getInfoByRegionName(@Param('region') region: string): Promise<InfoDto> {
  //   return await this.domainService.getInfoByRegionName(region);
  // }

  @Get()
  async findInfo(
    @Query('code') code: string,
    @Query('name') name: string,
    @Query('category') category: string,
  ): Promise<ResultInfoDto> {
    if (!code || !name) throw new NullPointerException('code or name is null or undefined');
    if (isNaN(Number(code))) throw new InvalidParamterException('code is not a number');

    if (category === 'realEstate') return await this.domainService.findInfo(code, name);
  }

  @Patch('scandal')
  async incrementScandalCount(@Body() info: IssueParameter): Promise<CommonResponse> {
    const fieldsToCheck = ['category', 'code', 'name'];

    for (const field of fieldsToCheck) {
      if (!info[field]) {
        throw new NullPointerException(`[[${field}]] is null or undefined`);
      }
    }

    return new CommonResponse(
      ResponseCodeEnums.SUCEEDED,
      await this.domainService.incrementScandalCount(info),
    );
  }

  @Get('/rank/search')
  async findSearchRankDefault(): Promise<CommonResponse> {
    return new CommonResponse(
      ResponseCodeEnums.SUCEEDED,
      await this.domainService.findRank('search', 1),
    );
  }

  @Get('/rank/search/:page')
  async findSearchRank(@Param('page') _page: number): Promise<CommonResponse> {
    if (!_page) _page = 1;
    return new CommonResponse(
      ResponseCodeEnums.SUCEEDED,
      await this.domainService.findRank('search', _page),
    );
  }

  @Get('/rank/scandal')
  async findScandalRankDefault(): Promise<CommonResponse> {
    return new CommonResponse(
      ResponseCodeEnums.SUCEEDED,
      await this.domainService.findRank('scandal', 1),
    );
  }

  @Get('/rank/scandal/:page')
  async findScandalRank(@Param('page') _page: number): Promise<CommonResponse> {
    if (!_page) _page = 1;
    return new CommonResponse(
      ResponseCodeEnums.SUCEEDED,
      await this.domainService.findRank('scandal', _page),
    );
  }
}
