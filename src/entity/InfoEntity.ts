export class InfoEntity {
  region1Code: string;
  region2Code: string;
  region3Code: string;
  code: string;
  scandalCount: number;
  regionFullName: string;
  name: string;
  searchCount: number;
  category: string;
  constructor(
    region1Code: string,
    region2Code: string,
    region3Code: string,
    code: string,
    scandalCount: number,
    regionFullName: string,
    name: string,
    searchCount: number,
    category: string,
  ) {
    this.region1Code = region1Code;
    this.region2Code = region2Code;
    this.region3Code = region3Code;
    this.code = code;
    this.scandalCount = scandalCount;
    this.regionFullName = regionFullName;
    this.name = name;
    this.searchCount = searchCount;
    this.category = category;
  }

  toObject(): object {
    return {
      region1Code: this.region1Code,
      region2Code: this.region2Code,
      region3Code: this.region3Code,
      code: this.code,
      scandalCount: this.scandalCount,
      regionFullName: this.regionFullName,
      name: this.name,
      searchCount: this.searchCount,
      category: this.category,
    };
  }
}
