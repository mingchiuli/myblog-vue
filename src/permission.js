import router from "./router";
import axios from "axios";
import store from "./store"

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {

  const token = sessionStorage.getItem("myToken")

  let hasRoute = store.state.menus.hasRoutes



  if (token && !hasRoute) { // 判断该路由是否需要登录权限

    axios.get("/sys/menu/nav", {
      headers: {
        Authorization: sessionStorage.getItem("myToken")
      }
    }).then(res => {

      // 拿到menuList
      store.commit("setMenuList", res.data.data)

      // 动态绑定路由
      let newRoutes = router.options.routes

      res.data.data.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e => {

            // 转成路由
            let route = menuToRoute(e)

            // 吧路由添加到路由管理中
            if (route) {
              newRoutes[0].children.push(route)
            }

          })
        }
      })

      newRoutes.forEach(item => {
        router.addRoute(item)
      })

      hasRoute = true
      store.commit("changeRouteStatus", hasRoute)

    })
  } else if (to.matched.some(record => record.meta.requireAuth) && !sessionStorage.getItem("myToken")) {

    next({path: '/login'})
  }

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
