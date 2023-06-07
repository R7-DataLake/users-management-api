import S from 'fluent-json-schema'

const schema = S.object()
  .prop('id', S.string().format('uuid').required())

export default {
  params: schema
}