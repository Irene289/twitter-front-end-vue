import { apiHelper } from '../utils/helpers'

export default {
  getTweets() {
    return apiHelper.get('/tweets')
  },
  deleteTweet({ id }) {
    return apiHelper.delete(`/admin/tweets/${id}`)
  },
  // 發推文
  createTweet({ description, UserId }) {
    return apiHelper.post('/tweets', { description, UserId })
  },
  // 回覆推文
  createReply({ TweetId, comment }) {
    return apiHelper.post(`tweets/${TweetId
      }/replies`, { comment })
  },
  // 拿到單一推文資訊
  getTweet({ id }) {
    return apiHelper.get(`/tweets/${id}`)
  },
  // 拿到單一推文底下所有回覆
  getReplies({ id }) {
    return apiHelper.get(`/tweets/${id}/replies`)
  },
  likeTweet({ id }) {
    return apiHelper.post(`/tweets/${id}/like`)
  },
  unlikeTweet({ id }) {
    return apiHelper.post(`/tweets/${id}/unlike`)
  }
}


