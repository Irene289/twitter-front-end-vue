import { apiHelper } from './../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getTweets() {
    return apiHelper.get('/tweets?limit=18', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}