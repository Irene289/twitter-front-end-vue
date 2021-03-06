import moment from 'moment'

export const fromNowFilter = {
  filters: {
    fromNow(datetime) {
      if (!datetime) return '-'

      const days = moment(datetime).fromNow()
      const now = new Date().getFullYear() 
      
      if (moment().year() === now && days.includes('days' || 'day' || '天' || '天前')) {
        // console.log(days)
        return moment(datetime).format("MM月DD日")
      } else if (moment().year() !== now) {
        return moment(datetime).format("YYYY年MM月DD日")
      } else {
        return moment(datetime).fromNow()
      }
    },
    format(datetime) {
      if (!datetime) return '-'

      moment.updateLocale('zh-tw', {
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
    // 自介上限 160 字
    textFilter(text) {
      let filteredText = ""
      //有些bio是null，return走
      if (!text){
        return "用戶有點神秘，想多認識可以追蹤他喔～"
      }
      if (text.length > 160) {
        filteredText = text.slice(0, 160)
        return filteredText
      } else {
        return text
      }
    },
    // 推文上限 140 字
    tweetFilter(text) {
      let filteredText = ""
      if (text.length > 140) {
        filteredText = text.slice(0, 140)
        return filteredText
      } else {
        return text
      }
    },
    //admin推文限制50字
    adminTextFilter(text){
      let filteredText = ""
      if (text.length > 50) {
        filteredText = text.slice(0, 50)
        return filteredText+"..."
      } else {
        return text
      }
    }
  }  
}

export const visitPage = {
  methods:{
    visitUserPage: function (id, pathName) {
      this.$router.push({
        name: pathName,
        params: {id:id}
      })
    }  
  }
}

export const imgFilter = {
  filters: {
    avatarFilter(img){
      return img || require('../assets/static/images/noImage@2x.png')
    },
    coverFilter(img) {
      return img || 'https://picsum.photos/630/300'
    }
  }
}
// 