import S from 'fluent-json-schema'

const schema = S.object()
  .prop('username', S.string().minLength(4).required())
  .prop('password', S.string().minLength(4).maxLength(16).required())
  .prop('first_name', S.string().minLength(2).maxLength(100).required())
  .prop('last_name', S.string().minLength(2).maxLength(100).required())
  .prop('hospcode', S.string().maxLength(5).minLength(5).required())
  .prop('province_code', S.string().maxLength(2).minLength(2).required())
  .prop('enabled', S.string().enum(['Y', 'N']).default('N'))
  .prop('email', S.string().format('email').required())
  .prop('ingress_zone', S.string().enum(['KHONKAEN', 'MAHASARAKHAM', 'ROIET', 'KALASIN']).required())

export default {
  body: schema
}