import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Signin from '../views/Signin.vue'
import NotFound from '../views/NotFound.vue'
import TwitterMain from '../views/TwitterMain.vue'
import {Toast} from '../utils/helpers'

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
    component: Signin
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
    meta: { requiresAuth: true }, 
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
    meta: { requiresAuth:true },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },    
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
    meta: { requiresAuth: false}, 
    component: Signin
  },
  {
    path: '/admin/tweets',
    name: 'admin-tweets',
    meta: { requiresAuth: true },   
    component: () => import('../views/AdminTweetsList.vue')
  },
  {
    path: '/admin/users',
    name: 'admin-users',  
    meta: { requiresAuth: true }, 
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
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  const storageToken = localStorage.getItem('token')
  const stateToken = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  // 使用 progress bar
  // store.commit("setIsLoading", true);

  // console.log(to.matched.some(record => record.meta.requiresAuth))
  // 路由元資訊 .meta $route.matched 搭配路由守衛 進行驗證
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (storageToken && storageToken !== stateToken) {
      isAuthenticated = await store.dispatch('fetchCurrentUser')
    }
    if(isAuthenticated){
      next()
      return
    } else {
      Toast.fire({
        icon: 'warning',
        title: '您訪問的頁面需要登入，若尚未註冊，請先註冊在登入'
      })
      next({ path: '/signin' })
      return
    }
  } else {
    next()
    return
  }
})

// router.afterEach((to, from) => {
//   console.log({to, from})
//   setTimeout(() => {
//     store.commit("setIsLoading", false);
//   }, 1000)
// })

export default router
