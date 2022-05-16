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
    },
    fromNowHour(dataTime) {
      return dataTime ? moment(dataTime).fromNow() : '-'
    }    
  }
}
export const textFilter = {
  filters: {
    textFilter(text) {
      let filteredText = ""
      //有些bio是null，return走
      if (!text){
        return "用戶有點神秘，想多認識可以點擊頭像或追蹤他喔～"
      }
      if (text.length > 160) {
        filteredText = text.slice(0, 160)
        return filteredText
      } else {
        return text
      }
    }
  }  
}
export const visitPage ={
  methods:{
    visitUserPage: function (id, pathName) {
      console.log('click')
      this.$router.push({
        name: pathName,
        params: id
      })
    }  
  }
}