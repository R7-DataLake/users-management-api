export interface ICreateHospital {
  hospcode: string
  hospname: string
  zone_code: string
  enabled: boolean
}
export interface IUpdateHospital {
  hospname: string
  zone_code: string
  enabled: boolean
}