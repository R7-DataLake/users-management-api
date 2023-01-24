import { ICreateHospital, IUpdateHospital } from "../types/hospital";

export class LibModel {

  constructor () { }

  async hospitals(postgrest: any, province_code: any) {
    let query = postgrest
      .from('hospitals')
      .select('hospcode,hospname,zones(code,name,ingress_topic)')
      .order('hospname', { ascending: true })
      .eq('province_code', province_code)
      .eq('is_deleted', false)
      .eq('enabled', true);

    return await query.limit(100);
  }

}
