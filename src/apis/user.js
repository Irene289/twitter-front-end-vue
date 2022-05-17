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
  update({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData)
  },
  getLikes({id}){
    return apiHelper.get(`/users/${id}/likes`)
  },
  getTopUsers({rank}){
    return apiHelper.get(`/users/top?limit=${rank}`)
  },
  follow(){
    return apiHelper.post('/followships')
  }
  unFollow({id}) {
    return apiHelper.delete(`/followships/${id}`)
  }
}