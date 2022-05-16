import Vue from 'vue'
import VueRouter from 'vue-router'
//TODO:Signin頁面元件確定要刪除的話，把AdminSignin的名字改成Signin
// import Signin from '../views/Signin.vue'
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
    component: () => import('../views/AdminSignin.vue')
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
        path: ':id/replies',
        name: 'twitter-replies',
        component: () => import('../views/TwitterReply.vue')
      }
    ]
  },
  // 前台使用者主頁
  {
    path: '/users/:id',
    // name: 'user-tweets',  
    component: () => import('../views/User.vue'),
    children:[
      {
        path: 'tweets',
        name: 'user-tweets',
        component: () => import('../views/UserTweets.vue')
      },
      {
        path: 'replies',
        name: 'user-replies',
        component: () => import('../views/UserReply.vue')
      },
      {
        path: 'likes',
        name: 'user-like',
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
        name:'follower',
        component: () => import('../views/UserFollower.vue')
      },
      {
        path: 'following',
        name:'following',
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
    path:'/users/:id',
    redirect:{name: 'user-tweet'}
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
  routes
})

export default router
