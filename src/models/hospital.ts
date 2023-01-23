import { ICreateHospital, IUpdateHospital } from "../types/hospital";

export class HospitalModel {

  constructor () { }

  async list(postgrest: any, province_code: any) {
    let query = postgrest
      .from('hospitals')
      .select('hospcode,hospname,province_code,enabled,is_deleted')
      .order('hospname', { ascending: true })

    if (province_code) {
      query.eq('province_code', province_code)
    }

    return await query.limit(100);
  }

  async save(postgrest: any, hospital: ICreateHospital) {
    return await postgrest.from('hospitals')
      .insert(hospital)
  }

  async update(postgrest: any, hospcode: any, hospital: IUpdateHospital) {
    return await postgrest.from('hospitals')
      .update(hospital)
      .eq('hospcode', hospcode)
  }

  async delete(postgrest: any, hospcode: any) {
    return await postgrest.from('hospitals')
      .update({ 'is_deleted': true })
      .eq('hospcode', hospcode)
  }

}
