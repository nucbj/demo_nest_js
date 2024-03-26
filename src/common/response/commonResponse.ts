import { ResponseCodeEnums } from '../enums/responseCodeEnums';

export class CommonResponse {
  code: string;
  data: any;

  constructor(_rsCode: ResponseCodeEnums, _data: any) {
    this.code = _rsCode;
    this.data = _data;
  }
}
