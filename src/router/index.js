import Vue from 'vue'
import BlogDetail from '../components/BlogDetail.vue'
import Intro from '../views/Intro.vue'
import VueRouter from 'vue-router';
import SystemWebs from "@/views/sys/SystemWebs";




Vue.use(VueRouter)

const routes = [
  {
    path: '/sys',
    component: () => import('@/views/System'),
    children: [
      {
        name: 'SystemWebs',
        path: 'webs',
        component: () => import('@/views/sys/SystemWebs'),
        meta: {
          title: '收藏检索',
        }
      },
    ]
  },


  {
    path: '/public',
    component: () => import('@/views/BlogParent'),
    children: [
      {
        name: 'Blogs',
        path: 'blogs/:currentPage',
        component: () => import('@/components/Blogs'),
        meta: {
          title: '博客列表',
        }
      },
      {
        path: 'blogs/:year/:currentPage',
        name: 'BlogsByYear',
        component: () => import('@/components/Blogs'),
        meta: {
          title: '博客归档'
        }
      },
      {
        path: 'blog/:blogId',
        name: 'BlogDetail',
        component: () => import('@/components/BlogDetail'),
      },
    ]
  },



  {
    path: '/other/:flag',
    name: 'Resume',
    component: () => import('@/views/Resume'),
    meta: {
      title: '简历'
    }
  },

  {
    path: '/intro',
    name: 'Intro',
    component: () => import('@/views/Intro'),
    meta: {
      title: '简介'
    }
  },

  {
    path: '/',
    name: 'Index',
    redirect: {name: "Intro"}
  },
  // {
  //   path: '/blogs/:currentPage',
  //   name: 'Blogs',
  //   component: () => import('@/components/Blogs'),
  //   meta: {
  //     title: '博客列表'
  //   }
  // },

  // {
  //   path: '/blogs/:year/:currentPage',
  //   name: 'BlogsByYear',
  //   component: () => import('@/components/Blogs'),
  //   meta: {
  //     title: '博客归档'
  //   }
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录博客'
    }
  },

  // {
  //   path: '/blog/:blogId',
  //   name: 'BlogDetail',
  //   component: BlogDetail,
  // },

  {
    path: "*", // 此处需特别注意置于最底部
    name: "notFound",
    component: () => import('@/views/NotFound'),
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,

  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
