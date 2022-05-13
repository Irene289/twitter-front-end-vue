import Vue from 'vue'
import VueRouter from 'vue-router'
import Signin from '../views/Signin.vue'
import NotFound from '../views/NotFound.vue'
import Twitter from '../views/Twitter.vue'
import TwitterMain from '../views/TwitterMain.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/signin'
  },
  {
    path: '/signin',
    name: 'sign-in',
    component: Signin
  },
  {
    path: '/regist',
    name: 'regist',
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
        component: Twitter
      },
      {
        path: 'replies',
        name: 'twitter-replies',
        component: () => import('../views/TwitterReply.vue')
      }
    ]
  },
  // 前台使用者主頁
  {
    path: '/users/:id/tweets',
    // name: 'user-tweets',  
    component: () => import('../views/User.vue'),
    children:[
      {
        path:'',
        component: () => import('../views/UserTweets.vue')
      },
      {
        path: 'replies',
        component: () => import('../views/UserReply.vue')
      },
      {
        path: 'likes',
        component: () => import('../views/UserLike.vue')
      },

    ]
  },
  // 前台使用者追蹤頁
  {
    path: '/users/:id/follow',
    // name: 'user-follow',
    component: () => import('../views/UserFollow.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/UserFollower.vue')
      },
      {
        path: 'following',
        component: () => import('../views/UserFollowing.vue')
      }  
    ]
  },
  {
    path:'/users/:id',
    redirect:'/users/:id/tweets'
  },
  {
    path: '/users/:id/setting',
    name: 'user-setting',
    component: () => import('../views/Setting.vue')
  },
  // 後台
  {
    path: '/admin',
    name: 'admin',
    component: Signin
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
  routes
})

export default router
