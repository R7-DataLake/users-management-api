import S from 'fluent-json-schema'

const bodySchema = S.object()
  .prop('hospname', S.string().minLength(2).maxLength(150).required())
  .prop('zone_code', S.string().required())
  .prop('enabled', S.string().enum(['Y', 'N']).default('N'))

const paramsSchema = S.object()
  .prop('hospcode', S.string().maxLength(5).minLength(5).required())

export default {
  body: bodySchema,
  params: paramsSchema
}