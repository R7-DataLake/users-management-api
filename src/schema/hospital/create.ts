import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().minLength(5).maxLength(5).required())
  .prop('hospname', S.string().minLength(2).maxLength(150).required())
  .prop('province_code', S.string().enum(['40', '44', '45', '46']).maxLength(2).minLength(2).required())
  .prop('enabled', S.string().enum(['Y', 'N']).default('N'))

export default {
  body: schema
}