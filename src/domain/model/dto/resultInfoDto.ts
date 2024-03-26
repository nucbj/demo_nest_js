import { InfoEntity } from 'src/entity/InfoEntity';

export class ResultInfoDto {
  code: string;
  scandalCount: number;
  regionFullName: string;
  name: string;
  searchCount: number;
  category: string;
  constructor(infoEntity: InfoEntity) {
    this.code = infoEntity.code;
    this.scandalCount = infoEntity.scandalCount;
    this.regionFullName = infoEntity.regionFullName;
    this.name = infoEntity.name;
    this.searchCount = infoEntity.searchCount;
    this.category = infoEntity.category;
  }

  toObject(): object {
    return {
      code: this.code,
      scandalCount: this.scandalCount,
      regionFullName: this.regionFullName,
      name: this.name,
      searchCount: this.searchCount,
      category: this.category,
    };
  }
}
