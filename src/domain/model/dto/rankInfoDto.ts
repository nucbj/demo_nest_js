import { InfoDto } from 'src/entity/InfoDto';

export class RankInfoDto {
  scandalCount: InfoDto[];
  searchCount: InfoDto[];
  scandal: InfoDto[];
  search: InfoDto[];
  constructor(scandalCount: InfoDto[], searchCount: InfoDto[], scandal: InfoDto[], search: InfoDto[]) {
    this.scandalCount = scandalCount;
    this.searchCount = searchCount;
    this.scandal = scandal;
    this.search = search;
  }
}
