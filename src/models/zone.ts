import { ICreateHospital, IUpdateHospital } from "../types/hospital";

export class ZoneModel {

  constructor () { }

  async list(postgrest: any) {
    return await postgrest
      .from('zones')
      .select()
      .order('name', { ascending: true })
      .eq('enabled', true);
  }

}
