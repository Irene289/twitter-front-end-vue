import {apiHelper} from '../utils/helpers'

export default {
  get({id}){
    return apiHelper.get(`/users/${id}`)
  },
  getTweets({id}){
    return apiHelper.get(`/users/${id}/tweets`)
  },
  getCurrentUser(){
    return apiHelper.get('/current_user')
  },
  update({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData)
  }
}