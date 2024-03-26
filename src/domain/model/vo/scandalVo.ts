export class ScandalVo {
  regionFullName: string;
  scandalCount: number;
  constructor(regionFullName: string, scandalCount: number) {
    this.regionFullName = regionFullName;
    this.scandalCount = scandalCount;
  }
}
