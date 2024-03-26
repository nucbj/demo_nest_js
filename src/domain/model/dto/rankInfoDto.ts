import { ScandalVo } from 'src/domain/model/vo/scandalVo';
import { SearchVo } from 'src/domain/model/vo/searchVo';

export class RankInfoDto {
  scandalCount: ScandalVo[];
  searchCount: SearchVo[];
  constructor(scandalCount: ScandalVo[], searchCount: SearchVo[]) {
    this.scandalCount = scandalCount;
    this.searchCount = searchCount;
  }
}
