import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().required())

export default {
  params: schema
}