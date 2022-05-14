import moment from 'moment'

export const fromNowFilter = {
  filters: {
    fromNow(datetime) {
      if (!datetime) return '-'

      const days = moment(datetime).fromNow()

      let now = new Date().getFullYear() 
      
      if (moment().year() === now) {
        return moment(datetime).format("MM月DD日")
      } else if (days.includes('day')) {
        return moment(datetime).format("YYYY年MM月DD日")
      } else {
        return moment(datetime).fromNow()
      }
    },
    format(datetime) {
      if (!datetime) return '-'

      moment.updateLocale('zh-cn', {
        meridiem: function (hour) {
          if (hour < 12) {
            return "上午"
          } else {
            return "下午"
          }
        }
      })

      const createdAt = moment(datetime).format("A hh:mm・YYYY年MM月DD日")
      
      return createdAt
    }
  }
}