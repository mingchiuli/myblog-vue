<template>
  <div>
    <strong>Blog Backstage</strong>

    <div class="header-avatar">

      <el-avatar size="medium" :src="avatar"></el-avatar>

      <el-dropdown>
						<span class="el-dropdown-link">
						{{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
        <el-dropdown-menu slot="dropdown">
          <!--          <el-dropdown-item>回到首页</el-dropdown-item>-->
          <el-dropdown-item @click.native="back">Back to the index page</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

<!--      <el-link href="/blogs/1">回到首页</el-link>不执行destoryed-->
      <el-link href="https://www.douban.com/people/164125579" target="_blank">douban</el-link>
      <el-link href="https://space.bilibili.com/64519456" target="_blank">bilibili</el-link>
    </div>

  </div>
</template>

<script>
export default {
  name: "BackHeader",

  data() {
    return {
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      username: 'Anonymous'
    }
  },
  methods: {
    back() {
      this.$router.push('/public/blogs/1')
    },
  },

  created() {
    if (localStorage.getItem('myToken')) {
      this.avatar = this.$store.state.myUserInfo.avatar
      this.username = this.$store.state.myUserInfo.username
    }
  }

}
</script>

<style scoped>
.header-avatar {
  float: right;
  width: 250px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

</style>
