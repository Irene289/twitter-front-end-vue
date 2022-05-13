import { apiHelper } from '../utils/helpers'

export default {
  signIn({ account, password }) {
    return apiHelper.post('/signin', {
      account,
      password
    })
  },
  regist({ account, name, email, password, passwordCheck }) {
    return apiHelper.post('/users', {
      account, 
      name, 
      email, 
      password, 
      passwordCheck
    })
  }
}