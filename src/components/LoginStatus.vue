<template>
  <div class="LS">
    <div v-if="hasLogin">
      <span><el-link class="LSLink" @click="init" type="primary">Homepage</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link class="LSLink" type="success" @click="add">Post</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link class="LSLink" type="warning" @click="backStage" v-if="isPC">Backstage</el-link></span>
      <el-divider direction="vertical" v-if="isPC"></el-divider>
      <span><el-link class="LSLink" type="danger" @click="logout">Logout</el-link></span>
    </div>

<!--    <div v-if="!hasLogin">-->
<!--      <span><el-link class="LSLink" @click="login" type="primary">Login</el-link></span>-->
<!--    </div>-->

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
      isPC: false
    }
  },
  methods: {

    // login() {
    //   this.$router.push('/login')
    // },

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
      this.$axios.post("/logout", null,{
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$store.commit("REMOVE_INFO")
      })
    }
  },
  created() {
    this.flag =  navigator.userAgent.match(/(phone|pod|iPhone|iPod|ios|Android|Moblie|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowerNG|WebOS|Symbian|Windows Phone)/i);
    if (this.flag === null) {
      this.isPC = true;
    }


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
.LS {
  margin-top: 40px;
  margin-bottom: 60px;
  text-align: center;
}

.LSLink {
  font-size: large
}

</style>
