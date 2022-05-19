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
  getReplies({id}){
    return apiHelper.get(`/users/${id}/replied_tweets`)
  },
  updateProfile({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData)
  },
  update({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData)
  },
  // update({ userId, formData }) {
  //   return apiHelper.put(`/users/${userId}/account`, formData)
  // },
  getLikes({id}){
    return apiHelper.get(`/users/${id}/likes`)
  },
  getTopUsers({rank}){
    return apiHelper.get(`/users/top?limit=${rank}`)
  }
}