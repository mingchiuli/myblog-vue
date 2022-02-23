<template>
  <div>
    <h2>发表日志</h2>

    <div class="m-content">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

<!--        el-form-item的prop="description"疑似没用-->
        <el-form-item label="摘要" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content" v-loading="loading">
          <mavon-editor v-model="ruleForm.content" :ishljs = "true" ref="md" code-style="androidstudio" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script>
  import Footer from "@/components/Footer";
  export default {
    name: "BlogEdit.vue",
    components: {Footer},
    data() {
      return {
        ruleForm: {
          id: '',
          title: '',
          description: '',
          content: '',
        },
        created: '',
        loading: false,


        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入摘要', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },

      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            this.$axios.post('/blog/edit', this.ruleForm, {
              headers: {
                "Authorization": sessionStorage.getItem("myToken")
              }
            }).then(res => {
              console.log(res)
              _this.$alert('操作成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push("/blogs/1")
                }
              });

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },


      imgAdd(pos, $file){
        // 第一步.将图片上传到服务器.
        const formdata = new FormData();
        formdata.append('image', $file);
        formdata.append('created', this.created)
        this.$axios({
          url: '/upload',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data',"Authorization": sessionStorage.getItem("myToken")},
        }).then((url) => {
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          // $vm.$img2Url 详情见本页末尾
          // $vm.$img2Url(pos, url);
          console.log(url)
          this.$refs.md.$img2Url(pos, url.data.data);
        })
      },

      imgDel(pos) {
        const formdata = new FormData()
        formdata.append('url', pos[0])
        this.$axios({
          url: '/delfile',
          method: 'delete',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data',"Authorization": sessionStorage.getItem("myToken")},
        })
        .catch(res => {
          console.log(res)
        })
      },

      assignData(res) {
        const blog = res.data.data
        this.ruleForm.id = blog.id
        this.ruleForm.title = blog.title
        this.ruleForm.description = blog.description
        this.ruleForm.content = blog.content
        this.created = blog.created
      }
    },
    created() {
      this.loading = true
      const blogId = this.$route.params.blogId
      console.log(blogId)
      const _this = this
      if(blogId && sessionStorage.getItem("myUserInfo") && JSON.parse(sessionStorage.getItem("myUserInfo")).role === 'admin') {
        this.$axios.get('/blogAuthorized/' + blogId, {
          headers: {
            "Authorization": sessionStorage.getItem("myToken")
          }
        }).then(res => {

          this.assignData(res)

          _this.loading = false
        })
      } else if (blogId && sessionStorage.getItem("myUserInfo")) {
        this.$axios.get('/blog/' + blogId).then(res => {

          this.assignData(res)

          _this.loading = false
        })
      } else {
        this.$axios.get('/addNewBlog', {
          headers: {
            "Authorization": sessionStorage.getItem("myToken")
          }
        }).then(res => {
          const id = res.data.data

          if (JSON.parse(sessionStorage.getItem("myUserInfo")).role === 'admin') {

            _this.$axios.get('/blogAuthorized/' + id, {
              headers: {
                "Authorization": sessionStorage.getItem("myToken")
              }
            }).then(res => {

              this.assignData(res)
              _this.loading = false
            })

          } else {
            this.$axios.get('/blog/' + id).then(res => {

              this.assignData(res)
              _this.loading = false
            })
          }
        })
      }

    }
  }
</script>

<style scoped>
  .m-content {
    text-align: center;
  }

  h2 {
    font-size: xx-large;
    margin-top: 5%;
    margin-bottom: 5%;
    text-align: center;
  }

  .el-form-item {
    max-width: 80%;
    margin-left: 7%;
  }
</style>
