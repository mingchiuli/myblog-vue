<template>
  <div>
<!--    侧边栏加上滚动条https://www.cnblogs.com/fuzitu/p/9473508.html-->
    <el-row style="position: fixed; overflow-y:scroll;top: 0;bottom: 0">
      <el-col :span="30" style="width: 241px">

<!--        <h4 style="margin-top: -50%; margin-bottom: -30%; margin-left: 15%; width: 25%;color: #333333">BackStage</h4>-->
        <h4 style="margin-left: 15%; margin-top: 10%;color: black">BackStage</h4>
        <el-menu
            :default-active="this.$store.state.menus.editableTabsValue"
            class="el-menu-vertical-demo"
            @close="handleClose"
            ref="menu"
            active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item index="SystemIndex" @click="selectMenu({name: 'SystemIndex', title: '访问统计'})"><i class="el-icon-location"></i>访问统计</el-menu-item>
            <el-menu-item index="SystemUsers" @click="selectMenu({name: 'SystemUsers', title: '账号管理'})"><i class="el-icon-user"></i>账号管理</el-menu-item>
            <el-menu-item index="SystemBlogs" @click="selectMenu({name: 'SystemBlogs', title: '日志管理'})"><i class="el-icon-edit-outline"></i>日志管理</el-menu-item>
            <el-menu-item index="SystemDeleted" @click="selectMenu({name: 'SystemDeleted', title: '删除管理'})"><i class="el-icon-delete"></i>删除管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-magic-stick"></i>
              <span>工具管理</span>
            </template>
            <el-menu-item index="SystemLogs" @click="selectMenu({name: 'SystemLogs', title: '系统日志'})"><i class="el-icon-s-management"></i>系统日志</el-menu-item>
            <el-menu-item index="SystemWebs" @click="selectMenu({name: 'SystemWebs', title: '收藏检索'})"><i class="el-icon-link"></i>收藏检索</el-menu-item>
            <el-menu-item index="SystemBooks" @click="selectMenu({name: 'SystemBooks', title: '书籍下载'})"><i class="el-icon-download"></i>书籍下载</el-menu-item>
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
      this.$router.push({name: item.name})
    },

    handleClose(key, keyPath) {
      // this.$refs.menu.open(keyPath)
      console.log(key, keyPath);
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
