import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    myToken: '',
    myUserInfo: JSON.parse(localStorage.getItem("myUserInfo")),
    users: [],
    hasLogin: false,
    title: '',
    url: ''
  },
  mutations: {
    // set
    SET_TOKEN: (state, token) => {
      state.myToken = token
      localStorage.setItem("myToken", token)
    }
    ,
    SET_USERINFO: (state, userInfo) => {
      state.myUserInfo = userInfo
      localStorage.setItem("myUserInfo", JSON.stringify(userInfo))
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
      localStorage.setItem("myToken", '')
      localStorage.setItem("myUserInfo", JSON.stringify(''))
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
