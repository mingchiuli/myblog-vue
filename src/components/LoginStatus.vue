<template>
  <div class="maction">
    <div v-if="hasLogin">
      <span><el-link @click="init" type="primary" style="font-size: large">Homepage</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" @click="add" style="font-size: large">Blog post</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="warning" @click="backStage" style="font-size: large">step into backstage</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="danger" @click="logout" style="font-size: large">logout</el-link></span>
    </div>
    <div v-if="!hasLogin">
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" @click="back" style="font-size: large">back</el-link></span>
      <el-divider direction="vertical"></el-divider>
    </div>
  </div>
</template>

<script>

export default {
  name: "LoginStatus",
  data() {
    return {
      user: {
        username: '',
        avatar: ''
      },
    }
  },
  methods: {

    back() {
      this.$router.back()
    },

    webs() {
      this.$router.push('/sys/webs')
    },

    init() {
      this.$router.push('/public/blogs/1')
    },

    add() {
      this.$router.push({name: 'BlogAdd'})
    },

    backStage() {
      const name = this.$store.state.menus.editableTabsValue
      this.$router.push({name: name})
    },


    logout() {
      const _this = this
      _this.$axios.get("/logout", {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        _this.$store.commit("REMOVE_INFO")
      })
    }
  },
  created() {

    if(this.$store.getters.getUser) {
      this.user.username = this.$store.getters.getUser.username
      this.user.avatar = this.$store.getters.getUser.avatar
      this.hasLogin = this.$store.state.hasLogin
    }
  },

  computed: {
    hasLogin: {
      get() {
        return this.$store.state.hasLogin
      },
      set(val) {
        this.$store.state.hasLogin = val
      }
    }
  },


}
</script>

<style scoped>
.maction {
  margin-top: 40px;
  margin-bottom: 25px;
  text-align: center;
}

</style>
