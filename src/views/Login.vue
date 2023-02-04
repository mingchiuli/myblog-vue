<template>
  <div>

    <el-container>
      <el-header>
        :)
      </el-header>
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
          <el-form-item label="Username" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item id="captcha" label="Captcha" prop="code">
            <div>
              <el-input style="" v-model="ruleForm.code" maxlength="5" @keyup.enter.native="submitForm('ruleForm')"></el-input>
              <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Login</el-button>
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    <Footer></Footer>
  </div>
</template>

<script>
  import Footer from "@/components/Footer";
  import qs from 'qs'
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
          key: '',
        },


        rules: {
          username: [
            { required: true, message: 'Please enter the username', trigger: 'blur' },
            { min: 3, max: 15, message: '3 to 25 characters in length', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please enter the password', trigger: 'change' }
          ],
          code: [
            { required: true, message: 'Please enter the captcha', trigger: 'blur' },
            { min: 5, max: 5, message: '5 characters in length', trigger: 'blur' }
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

          this.ruleForm.key = res.data.data.token
          this.captchaImg = res.data.data.captchaImg
          this.ruleForm.code = ''
        })
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/login?' + qs.stringify(this.ruleForm)).then(res => {

              // 把数据共享出去
              this.$store.commit("SET_TOKEN", res.data.data.token)
              this.$store.commit("SET_USERINFO", res.data.data.user)
              this.$store.commit("SET_LOGIN", true)
              this.$router.push('/public/blogs/1')

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
      if (localStorage.getItem('myToken')) {
        this.$router.push('/public/blogs/1')
        return
      }
      this.getCaptcha()
    }
  }
</script>

<style scoped lang="less">
.demo-ruleForm {
  width: 60%;
  margin: 0 auto;
}

.el-main {
  margin-top: 8%;
  margin-left: 20%;
  height: 100%
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 170%;
  margin: 0 auto;
  width: 100%;
  font-size: xx-large;
}

.el-form-item {
  width: 400px;
}

#captcha div {
  display: flex;
  flex-direction: row;
}

#captcha {
  .el-input {
    width: 200px;
    float: bottom;
  }
}

</style>
