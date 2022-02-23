import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    myToken: '',
    myUserInfo: JSON.parse(sessionStorage.getItem("myUserInfo")),
    users: [],
    hasLogin: false,
    title: '',
    url: ''
  },
  mutations: {
    // set
    SET_TOKEN: (state, token) => {
      state.myToken = token
      sessionStorage.setItem("myToken", token)
    }
    ,
    SET_USERINFO: (state, userInfo) => {
      state.myUserInfo = userInfo
      sessionStorage.setItem("myUserInfo", JSON.stringify(userInfo))
    },

    SET_USERS: (state, users) => {
      state.users = users
    },

    SET_LOGIN: (state, login) => {
      state.hasLogin = login
    },

    REMOVE_INFO: (state) => {
      state.myToken = ''
      state.myUserInfo = {}
      sessionStorage.setItem("myToken", '')
      sessionStorage.setItem("myUserInfo", JSON.stringify(''))
      state.users = []
      state.hasLogin = false
    }

  },
  getters: {
    // get
    getUser: state => {
      return state.myUserInfo
    },
  },
  actions: {
  },
  modules: {
    menus
  }
})
