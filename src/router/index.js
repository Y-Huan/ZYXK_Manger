import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'index',
        meta: { title: '??????', icon: 'el-icon-s-home', affix: true }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/school',
    component: Layout,
    redirect: '/school/index',
    name:'school',
    meta:{
      icon: 'xuexiao',
      title:'??????'

    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/school/index'),
        name: 'schoolIndex',
        meta: { title: '????????????'}
      }

    ]
  },
  {
    path: '/college',
    component: Layout,
    redirect: '/college/index',
    name:'school',
    meta:{
      icon: 'xuexiao',
      title:'??????'

    },
    children: [

      {
        path: 'college',
        component: () => import('@/views/college/index'),
        name: 'collegeIndex',
        meta: { title: '????????????'}
      }
    ]
  },
  {
    path: '/major',
    component: Layout,
    redirect: '/major/index',
    name:'major',
    meta:{
      icon: 'xuexiao',
      title:'??????'

    },
    children: [
      {
        path: 'major',
        component: () => import('@/views/major/index'),
        name: 'majorIndex',
        meta: { title: '????????????'}
      },
      {
        path: 'clase',
        component: () => import('@/views/major/clase'),
        name: 'majorClaes',
        meta: { title: '????????????'}
      },
      {
        path: 'claseDetail/:id',
        hidden:true,
        component: () => import('@/views/major/claseDetail'),
        name: 'claseDetail',
        meta: { title: '????????????'}
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/index',
    name:'course',
    meta:{
      icon: 'kecheng',
      title:'????????????'

    },
    children: [

      {
        path: 'course',
        component: () => import('@/views/course/index'),
        name: 'courseIndex',
        meta: { title: '????????????'}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta:{
      icon: 'user',
      title:'??????'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'user',
        meta: { title: '????????????',  }
      },
      {
        path: 'role',
        component: () => import('@/views/user/role'),
        name: 'role',
        meta: { title: '????????????',  }
      },
      {
        path: 'authority',
        component: () => import('@/views/user/authority'),
        name: 'authority',
        meta: { title: '????????????',  }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  //mode: 'history',
  base:'/zyxk/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
