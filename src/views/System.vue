<template>
  <div>
    <el-container>

      <el-aside width="240px">
        <SideMenu></SideMenu>
      </el-aside>

      <el-container>

        <el-header height="65px">
          <BackHeader></BackHeader>
        </el-header>
        <el-main>
          <Tabs></Tabs>
          <div style="margin: 0 1%;">
            <router-view/>
          </div>
        </el-main>
      </el-container>

    </el-container>

  </div>
</template>

<script>
import SideMenu from "@/components/sys/SideMenu";
import Tabs from "@/components/sys/Tabs";
import BackHeader from "@/components/sys/BackHeader";
export default {
  name: "System",
  components: {BackHeader, SideMenu, Tabs}
}
</script>

<style scoped>



.el-container {
  padding: 0;
  margin: 0;
  height: 950px;
}

.header-avatar {
  width: 210px;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: #f6f6f6;
  color: #333;
  text-align: center;
  line-height: 65px;
}

.el-aside {
  background-color: #ffffff;
  color: #ffffff;
  line-height: 20px;
}

.el-main {
  color: #333;
  padding: 0;
}

a {
  text-decoration: none;
}

</style>
