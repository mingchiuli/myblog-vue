<template>
  <div>
<!--    侧边栏加上滚动条https://www.cnblogs.com/fuzitu/p/9473508.html-->
    <el-row style="position: fixed; overflow-y:scroll;top: 0;bottom: 0">
      <el-col :span="30" style="width: 241px">

        <h4 style="margin-left: 15%; margin-top: 10%;color: black">BackStage</h4>

        <el-menu
            :default-active="this.$store.state.menus.editableTabsValue"
            class="el-menu-vertical-demo"
            active-text-color="#ffd04b">

          <el-submenu :index="menu.menuId + ''" v-for="menu in menuList">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span>{{menu.title}}</span>
            </template>

            <a @click="to(item.name)" v-for="item in menu.children">
              <el-menu-item :index="item.name" @click="selectMenu(item)">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{item.title}}</span>
                </template>
              </el-menu-item>
            </a>

          </el-submenu>
        </el-menu>



      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  methods: {
    selectMenu(item) {
      this.$store.commit("addTab", item)
    },

    to(name) {
      this.$router.push({name: name})
    }
  },
  computed:  {
    menuList: {
      get() {
        return this.$store.state.menus.menuList
      }
    }
  }
}


</script>

<style scoped>



</style>
