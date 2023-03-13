import { Knex } from 'knex'

export class ReportModel {

  constructor () { }

  async getTotalUsers(db: Knex) {
    const sql = `
      select count(1) as total, z."name" as zone_name
      from users as u
      inner join hospitals h on h.hospcode=u.hospcode
      inner join zones z on z.code=h.zone_code
      group by z.code;
    `;

    return db.raw(sql);
  }

  async getLastSending(db: Knex, start: any, end: any) {
    const sql = `
      select count(t.user_id) as total, 
      to_char(t.created_at::date, 'yyyy-mm-dd') as request_date, z."name" as zone_name 
      from tokens t 
      inner join users u on u.id=t.user_id
      inner join hospitals h on h.hospcode=u.hospcode
      inner join zones z on z.code=h.zone_code
      where to_char(t.created_at::date, 'yyyy-mm-dd') between ? and ?
      group by request_date, zone_name
      order by request_date asc;
    `;

    return db.raw(sql, [start, end]);
  }

  async getHospitalLastSend(db: Knex) {
    const sql = `
      select t.created_at as last_update, h.hospcode, h.hospname
      from tokens t
      inner join users u on u.id=t.user_id 
      inner join hospitals h on h.hospcode=u.hospcode
      order by t.created_at desc
      limit 20;
    `;

    return db.raw(sql);
  }

  async getHospitalLastNotSend(db: Knex) {
    const sql = `
      select h.hospcode, h.hospname, (select max(t2.created_at) from tokens t2 where t2.hospcode=h.hospcode ) as last_update
      from tokens t
      inner join users u on u.id=t.user_id 
      inner join hospitals h on h.hospcode=u.hospcode
      where t.created_at < (current_date - interval '5 day')
      group by h.hospcode
      order by last_update desc
      limit 20;
    `;

    return db.raw(sql);
  }

}
