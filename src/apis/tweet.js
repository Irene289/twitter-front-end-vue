import {apiHelper} from '../utils/helpers'

export default{
  getTweets() {
    return apiHelper.get('/tweets')
  },
  deleteTweet({id}){
    return apiHelper.delete(`/admin/tweets/${id}`)
  }
}


