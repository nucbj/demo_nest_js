export class SearchVo {
  regionFullName: string;
  searchCount: number;
  constructor(regionFullName: string, searchCount: number) {
    this.regionFullName = regionFullName;
    this.searchCount = searchCount;
  }
}
