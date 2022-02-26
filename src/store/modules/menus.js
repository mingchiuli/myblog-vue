import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {

        menuList: [],
        hasRoutes: false,

        editableTabsValue: 'SystemWebs',
        editableTabs: [{
            title: '首页',
            name: 'SystemWebs',
        }]
    },
    mutations: {
        setMenuList(state, menus) {
            state.menuList = menus
        },

        changeRouteStatus(state, hasRoutes) {
            state.hasRoutes = hasRoutes
        },

        addTab(state, tab) {

            let index = state.editableTabs.findIndex(e => e.name === tab.name)

            if (index === -1) {
                state.editableTabs.push({
                    title: tab.title,
                    name: tab.name,
                });
            }

            state.editableTabsValue = tab.name;
        },

        resetState: (state) => {
            state.menuList = []
            state.hasRoutes = false

            state.editableTabsValue = 'SystemWebs'
            state.editableTabs = [{
                title: '收藏检索',
                name: 'SystemWebs',
            }]
        }

    },
    actions: {},

}
