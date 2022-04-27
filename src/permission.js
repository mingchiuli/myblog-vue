import router from "./router";
import axios from "axios";
import store from "./store"

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {

  const token = localStorage.getItem("myToken")

  let hasRoute = store.state.menus.hasRoutes

  if (token && !hasRoute) { // 判断该路由是否需要登录权限

    axios.get("/sys/menu/nav", {
      headers: {
        Authorization: localStorage.getItem("myToken")
      }
    }).then(res => {

      let temp = []

      res.data.data.forEach(item => {
        //有孩子说明是后台路由
        if (item.children.length !== 0) {
          temp.push(item)
        }
      })

      console.log(temp)
      // 拿到menuList
      store.commit("setMenuList", temp)

      // 动态绑定路由
      let newRoutes = router.options.routes

      let data = res.data.data

      //递归构建路由
      data.forEach(item => {
        recursive(item, newRoutes)
      })


      newRoutes.forEach(item => {
        router.addRoute(item)
      })

      hasRoute = true
      store.commit("changeRouteStatus", hasRoute)

    })
  }

  // else if (from.name !== 'Blogs' && to.matched.some(record => record.meta.requireAuth) && !localStorage.getItem("myToken")) {
  //
  //   next({path: '/login'})
  //
  // }

  next()

})
// // 导航转成路由
const menuToRoute = (menu) => {

  if (!menu.component) {
    return null
  }

  const route = {
    name: menu.name,
    path: menu.url,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  };

  route.component = () => import('@/views/' + menu.component +'.vue')

  return route
}

// 算法优化，递归构建路由
const recursive = (data, newRoutes) => {

  if (data.children) {
    data.children.forEach(item => {
      recursive(item, newRoutes)
    })
  }

  let route = menuToRoute(data)
  if (route && ((route.name === 'BlogEdit') || (route.name === 'BlogAdd') || (route.name === 'Cooperate'))) {
    newRoutes.push(route)
  } else if (route) {
    newRoutes[0].children.push(route)
  }

}




