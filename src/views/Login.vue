<template>
  <div>

    <el-container>
      <el-header style="text-align: center; font-size: xx-large;">
        :)
      </el-header>
      <el-main style="margin-top: 8%;margin-left: 20%;height: 100%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
          <el-form-item label="用户名" prop="username" style="width: 400px">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="width: 400px">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code"  style="width: 380px;">
            <div style="display: flex; flex-direction: row">
              <el-input v-model="ruleForm.code"  style="width: 200px; float: bottom" maxlength="5" @keyup.enter.native="submitForm('ruleForm')"></el-input>
              <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>


  </div>
</template>

<script>
  import Footer from "@/components/Footer";
  export default {
    name: "Login",
    components: {Footer},
    comments: {Footer},
    data() {
      return {
        ruleForm: {
          username: '',
          password: '',
          code: '',
          token: '',
        },


        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请选择密码', trigger: 'change' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur' }
          ],
        },
        captchaImg: null
      };
    },
    methods: {

      menuToRoute(menu) {
        if (!menu.component) {
          return null
        }

        let route = {
          name: menu.name,
          path: menu.path,
          meta: {
            icon: menu.icon,
            title: menu.title
          }
        }
        route.component = () => import('@/views/' + menu.component +'.vue')

        return route
      },

      getCaptcha() {
        this.$axios.get('/captcha').then(res => {

          this.ruleForm.token = res.data.data.token
          this.captchaImg = res.data.data.captchaImg
          this.ruleForm.code = ''
        })
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            this.$axios.post('/login', this.ruleForm).then(res => {

              // console.log(res.data)
              const jwt = res.headers['authorization']
              const userInfo = res.data.data

              // 把数据共享出去
              _this.$store.commit("SET_USERINFO", userInfo)
              _this.$store.commit("SET_TOKEN", jwt)
              _this.$store.commit("SET_LOGIN", true)

              _this.$router.push('blogs/1')

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      if (sessionStorage.getItem('myToken')) {
        this.$router.push('/blogs/1')
        return
      }
      this.getCaptcha()
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 170%;
    margin: 0 auto;
    width: 100%;
  }

  .el-main {
    height: 330px;
  }

  .demo-ruleForm {
    max-width: 60%;
    margin: 0 auto;
  }

</style>
