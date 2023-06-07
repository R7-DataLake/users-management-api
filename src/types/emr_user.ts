export interface ICreateEMRUser {
  cid: string
  password: string
  first_name: string
  last_name: string
  hospcode: string
  enabled: boolean
  email: string
}
export interface IUpdateEMRUser {
  first_name: string
  last_name: string
  hospcode: string
  enabled: boolean
  email: string
}