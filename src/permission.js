import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false })
const whiteList = ['/login']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasInfo = store.getters.userInfo;
      if (hasInfo) {
        if(store.getters.permission_routes.length){
          next();
        }else{
          const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        }
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
