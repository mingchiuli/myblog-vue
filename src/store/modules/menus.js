import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {

        menuList: [],

        editableTabsValue: 'SystemIndex',
        editableTabs: [{
            title: '首页',
            name: 'SystemIndex',
        }]
    },
    mutations: {
        setMenuList(state, menus) {
            state.menuList = menus
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

            state.editableTabsValue = 'SystemIndex'
            state.editableTabs = [{
                title: '首页',
                name: 'SystemIndex',
            }]
        }

    },
    actions: {},

}
