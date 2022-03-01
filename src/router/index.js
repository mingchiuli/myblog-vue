import Vue from 'vue'
import BlogDetail from '../views/BlogDetail.vue'
import Intro from '../views/Intro.vue'
import Cooperate from "@/views/Cooperate";
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
    path: '/cooperate/:blogId/:coNumber',
    name: Cooperate,
    component: () => import('@/views/Cooperate'),
    meta: {
      title: '合作编辑',
      requireAuth: true
    }
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
    path: '/footer',
    name: 'Footer',
    component: () => import('@/components/Footer'),
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
  {
    path: '/blogs/:currentPage',
    name: 'Blogs',
    component: () => import('@/views/Blogs'),
    meta: {
      title: '博客列表'
    }
  },

  {
    path: '/blogs/:year/:currentPage',
    name: 'BlogsByYear',
    component: () => import('@/views/Blogs'),
    meta: {
      title: '博客归档'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录博客'
    }
  },
  {
    path: '/blog/add',
    name: 'BlogAdd',
    component: () => import('@/views/BlogEdit'),
    meta: {
      requireAuth: true,
      title: '新建博客'
    }
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: BlogDetail,
    meta: {
      requireAuth: true,
      title: '编辑博客'
    }
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    component: () => import('@/views/BlogEdit'),
    meta: {
      requireAuth: true,
      title: '编辑博客'
    }
  },

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
