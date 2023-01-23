import S from 'fluent-json-schema'

const changePasswordSchema = S.object()
  .prop('id', S.string().format('uuid').required())
  .prop('password', S.string().minLength(4).maxLength(16).required())

export default {
  body: changePasswordSchema
}