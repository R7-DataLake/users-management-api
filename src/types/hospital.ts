export interface ICreateHospital {
  hospcode: string;
  hospname: string;
  province_code: string;
  enabled: boolean;
}
export interface IUpdateHospital {
  hospname: string;
  province_code: string;
  enabled: boolean;
}