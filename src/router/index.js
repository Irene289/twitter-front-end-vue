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
    // name: 'twitter-main',
    component: TwitterMain,
    children: [
      {
        path: '',
        name: 'twitter',
        component: () => import('../views/Twitter.vue')
      },
      {
        path: ':id/replies',
        name: 'twitter-replies',
        component: () => import('../views/TwitterReply.vue')
      }
    ]
  },
  // 前台使用者主頁
  {
    path: '/users',  
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
  console.log(isAuthenticated)
  //註冊完直接跳轉
  // if(!store.state.currentUser.is_admin){
  //   isAuthenticated = await store.dispatch('fetchCurrentUser')
  //   console.log(isAuthenticated)
    
  // }

  // if(storageToken && storageToken!==stateToken) {
  // console.log(isAuthenticated)
  // const noNeedAuthenticated = ['sign-in', 'regist']

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
  // console.log(to.matched) 
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
})

export default router
