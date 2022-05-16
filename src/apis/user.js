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
  }
}