import {apiHelper} from '../utils/helpers'

export default{
  getTweets() {
    return apiHelper.get('/tweets')
  },
  deleteTweet({id}){
    return apiHelper.delete(`/admin/tweets/${id}`)
  },
  createTweet({ text }) {
    return apiHelper.post('/tweets', {text})
  },
  // 拿到單一推文跟他的所有回覆
  getReply({ id }) {
    return apiHelper.get(`/tweets/${id}`)
  }
}


