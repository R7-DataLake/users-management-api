
export class LoginModel {

  constructor () { }

  async adminLogin(postgrest: any, username: any) {
    return await postgrest
      .from('admin')
      .select('id,password')
      .eq('username', username)
      .eq('enabled', true)
      .single();
  }

  async userLogin(postgrest: any, username: any) {
    return await postgrest
      .from('users')
      .select('id,password')
      .eq('username', username)
      .eq('enabled', true)
      .single();
  }

}
