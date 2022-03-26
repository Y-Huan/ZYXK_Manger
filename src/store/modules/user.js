import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken,getInfo, setInfo, removeInfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo:getInfo()?JSON.parse(getInfo()):''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.userInfo = info;
  },
  SET_INIT_INFO:(sate)=>{
    state.token = ''
    state.userInfo = '';
    removeToken()
    removeInfo()
    resetRouter()
  }
}

const actions = {
  login({ commit,state, dispatch}, userInfo) {
    const { username, password , type } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username, password: password , type: type }).then(response => {
        console.log(response)
        commit('SET_TOKEN', response.token);
        setToken(response.token);
        commit('SET_INFO', response);
        setInfo(response);
        resetRouter()
        dispatch('permission/generateRoutes',[response.authorityPermission],{ root: true }).then(res=>{
          router.addRoutes(res)
          resolve()
        }).catch(err=>{reject(err)})
      }).catch(err=>{reject(err)})
    })
  },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_INFO', '')
        removeToken()
        removeInfo()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        commit('SET_TOKEN', '')
        commit('SET_INFO', '')
        removeToken()
        removeInfo()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        reject(error)
      })
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_INFO', '')
      removeToken()
      removeInfo()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
