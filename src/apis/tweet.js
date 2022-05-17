import {apiHelper} from '../utils/helpers'

export default{
  getTweets() {
    return apiHelper.get('/tweets')
  },
  deleteTweet({id}){
    return apiHelper.delete(`/admin/tweets/${id}`)
  },
  // createTweet({ id, description, UserId, createdAt }) {
  //   return apiHelper.post('/tweets', { id, description, UserId, createdAt })
  // },

  createTweet({ description, UserId }) {
    return apiHelper.post('/tweets', { description, UserId })
  },
  // 拿到單一推文跟他的所有回覆
  getReply({ id }) {
    return apiHelper.get(`/tweets/${id}`)
  }
}


