import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
//TODO:Signin頁面元件確定要刪除的話，把AdminSignin的名字改成Signin
// import Signin from '../views/Signin.vue'
import NotFound from '../views/NotFound.vue'
// import Twitter from '../views/Twitter.vue'
import TwitterMain from '../views/TwitterMain.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    meta: { requiresAuth: false },
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'sign-in',
    meta: { requiresAuth: false },
    component: () => import('../views/AdminSignin.vue')
  },
  {
    path: '/regist',
    name: 'regist',
    meta: { requiresAuth: false },
    component: () => import('../views/Regist.vue')
  },
  // 前台首頁
  {
    path: '/twitter', 
    // meta: { requiresAuth: true }, 
    // name: 'twitter-main',
    component: TwitterMain,
    children: [
      {
        path: '',
        name: 'twitter',
        // meta: { requiresAuth: true }, 
        component: () => import('../views/Twitter.vue')
      },
      {
        path: ':id/replies',
        name: 'twitter-replies',
        // meta: { requiresAuth: true }, 
        component: () => import('../views/TwitterReply.vue')
      }
    ]
  },
  // 前台使用者主頁
  {
    path: '/users',  
    // meta: { requiresAuth:true },
    // name: 'user-tweets',  
    component: () => import('../views/User.vue'),
    children: [
      {
        path: ':id/tweets',
        name: 'user-tweets',
        component: () => import('../views/UserTweets.vue')
      },
      {
        path: ':id/replies',
        name: 'user-replies',
        component: () => import('../views/UserReply.vue')
      },
      {
        path: ':id/likes',
        name: 'user-like',
        component: () => import('../views/UserLike.vue')
      },

    ]
  },
  // 前台使用者追蹤頁
  {
    path: '/users',
    // meta: { requiresAuth: true },
    // name: 'user-follow',
    component: () => import('../views/UserFollow.vue'),
    children: [
      {
        path: ':id/follower',
        name: 'follower',
        component: () => import('../views/UserFollower.vue')
      },
      {
        path: ':id/following',
        name: 'following',
        component: () => import('../views/UserFollowing.vue')
      }
    ]
  },
  {
    path: '/users/:id/setting',
    name: 'user-setting',
    // meta: { requiresAuth: true },    
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/users/:id',
    redirect: { name: 'user-tweets' }
  },

  // 後台
  {
    path: '/admin',
    name: 'admin',  
    component: () => import('../views/AdminSignin.vue')
  },
  {
    path: '/admin/tweets',
    name: 'admin-tweets',    
    component: () => import('../views/AdminTweetsList.vue')
  },
  {
    path: '/admin/users',
    name: 'admin-users',   
    component: () => import('../views/AdminUsers.vue')
  },
  // NotFound
  {
    path: '*',
    name: 'not-fount',
    component: NotFound
  }
]

const router = new VueRouter({
  // linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (from, to, next) => {
  const storageToken = localStorage.getItem('token')
  const stateToken = store.state.token
  let isAuthenticated = store.state.isAuthenticated
  // const noNeedAuthenticated = ['signin', 'regist', 'admin']
  // console.log('登入:',isAuthenticated)

  if (storageToken && storageToken !== stateToken) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }
  //TODO:未登入訪問頁面導向signin ;已登入訪問signin, sign up頁面導向twitter 或 adminTweet
  // if (!isAuthenticated && !noNeedAuthenticated.includes(to.name)){
  //   next('/signin')
  //   return
  // }
  // if (isAuthenticated && noNeedAuthenticated.includes(to.name)){
  //   next('/twitter')
  //   return
  // }

  // next()

  // 上面會有無窮迴圈，改為以下
  // console.log(to.meta) 
  // console.log(to.meta) 
  // console.log(to.matched.some(record => record.meta.requiresAuth))
  // 路由元資訊 .meta $route.matched 搭配路由守衛 進行驗證
  if (to.matched.some(record => record.meta.requiresAuth)) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
    isAuthenticated
      ? next({ path: '/twitter' })
      : next({ path: '/signin' })
    return
  } else {
    next()
    return
  }
  //如果需要驗證的頁面，但沒有登入
  // if (to.meta.requiresAuth && !isAuthenticated){
  //   return next({ path: '/signin' })
  // }
  // console.log(to.matched)
  //訪問的頁面需要驗證的話
  // if (to.matched.some(record => record.meta.requiresAuth )) {
  //   console.log('需要驗證')
  //   console.log('驗證',to.path)
  // 如果已經有驗證（sign in 的時候驗證），就可以next()
    // if (isAuthenticated) {
    //   next()
    // }

      // 若沒有驗證而且前往的頁面是首頁，那就跳轉至signin頁面
  //     else if(!isAuthenticated && to.path === '/twitter'){
  //     console.log('twitter')
  //     next({ path: '/signin' })
  //   }
  // }
    // isAuthenticated = await store.dispatch('fetchCurrentUser') 
    // isAuthenticated
    //   ? next({ path: '/twitter' })
    //   : next({ path: '/signin' })
    // return
  // } 
  //   else {
  //     console.log('不需驗證')
  //     console.log('不用驗證',to.path)
  //     next()
  //     return
  //   }
  
  // next()
  
})

export default router
