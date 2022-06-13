<template>
  <div>
    <h2>Publish Blog</h2>

    <div class="m-content">

      <el-form :model="contentForm" :rules="rules" ref="contentForm" label-width="100px" class="demo-contentForm">
        <el-form-item label="title" prop="title">
          <el-input v-model="contentForm.title"></el-input>
        </el-form-item>

<!--        el-form-item的prop="description"疑似没用-->
        <el-form-item label="description" prop="description">
          <el-input type="textarea" v-model="contentForm.description"></el-input>
        </el-form-item>




        <el-upload
            action="#"
            style="width: 30%; margin-left: 35%"
            class="upload-demo"
            :on-remove="removeCover"
            :file-list="fileList"
            :http-request="uploadCover"
            list-type="text">
          <el-button size="small" type="primary">Click to upload the cover</el-button>
        </el-upload>
        <br/>

        <el-image :src="fileList.length === 0 ? '' : fileList[0].url" style="width: 30%">
        </el-image>
        <div>Cover Preview</div>
        <br/>

<!--        <el-form-item label="封面" prop="link" v-loading="loading">-->
<!--          <el-input v-model="contentForm.link"></el-input>-->
<!--        </el-form-item>-->

        <el-form-item label="内容" prop="content" v-loading="loading">
          <mavon-editor v-model="contentForm.content" :ishljs = "true" ref="md" code-style="androidstudio" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('contentForm')">Submit</el-button>
          <el-button @click="resetForm('contentForm')">Reset</el-button>
        </el-form-item>
      </el-form>


    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Global from '@/Global';
import Footer from "@/components/Footer";
  export default {
    name: "BlogEdit.vue",
    components: {Footer},
    data() {
      return {
        contentForm: {
          id: '',
          title: '',
          description: '',
          content: '',
          link: ''
        },
        created: '',
        loading: false,
        uploadUrl : Global.url + '/upload',


        rules: {
          title: [
            {required: true, message: 'Please enter the title', trigger: 'blur'},
            {min: 3, max: 50, message: '3 to 50 characters in length', trigger: 'blur'}
          ],
          description: [
            {required: true, message: 'Please enter the description', trigger: 'blur'}
          ],
          content: [
            {required: true, message: 'Please enter the content', trigger: 'blur'}
          ]
        },

        fileList: []


      };
    },
    methods: {
      removeCover(file) {
        const formdata = new FormData()
        formdata.append('url', file.url)
        this.$axios({
          url: '/delfile',
          method: 'delete',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data',"Authorization": localStorage.getItem("myToken")},
        }).then(res => {
          this.fileList = []
          this.contentForm.link = ''
        })
            .catch(res => {
              console.log(res)
            })
      },

      uploadCover(image) {
        // 第一步.将图片上传到服务器.
        const formdata = new FormData();
        formdata.append('image', image.file);
        formdata.append('created', this.created)
        this.$axios({
          url: '/upload',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data',"Authorization": localStorage.getItem("myToken")},
        }).then((url) => {
          // 第二步.将返回的url替换
          console.log(url)
          this.fileList.push({name: 'Cover', url: url.data.data})
          this.contentForm.link = url.data.data
        })
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/blog/edit', this.contentForm, {
              headers: {
                "Authorization": localStorage.getItem("myToken")
              }
            }).then(res => {
              console.log(res)
              this.$alert('Operation Successful!', 'Prompt', {
                confirmButtonText: 'Confirm',
                callback: action => {
                  this.$router.push('/public/blog/' + this.contentForm.id)
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
          headers: { 'Content-Type': 'multipart/form-data',"Authorization": localStorage.getItem("myToken")},
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
          headers: { 'Content-Type': 'multipart/form-data',"Authorization": localStorage.getItem("myToken")},
        })
        .catch(res => {
          console.log(res)
        })
      },

      assignData(res) {
        const blog = res.data.data
        this.contentForm.id = blog.id
        this.contentForm.title = blog.title
        this.contentForm.description = blog.description
        this.contentForm.content = blog.content
        this.contentForm.link = blog.link
        if (blog.link !== '') {
          this.fileList.push({name: 'Cover', url: blog.link})
        }
        this.created = blog.created
      }
    },
    created() {
      this.loading = true
      const blogId = this.$route.params.blogId
      //是本人操作
      if(blogId && localStorage.getItem("myUserInfo") && JSON.parse(localStorage.getItem("myUserInfo")).role === 'ROLE_admin') {
        this.$axios.get('/blogAuthorized/' + blogId, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {

          this.assignData(res)

          this.loading = false
        })
        //是其他小伙伴操作
      } else if (blogId && localStorage.getItem("myUserInfo")) {
        this.$axios.get('/blog/' + blogId).then(res => {

          this.assignData(res)

          this.loading = false
        })
      } else {
        //是添加操作
        this.$axios.get('/addNewBlog', {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
          //拿到新文章的id
          const id = res.data.data

          //是本人操作
          if (JSON.parse(localStorage.getItem("myUserInfo")).role === 'ROLE_admin') {

            this.$axios.get('/blogAuthorized/' + id, {
              headers: {
                "Authorization": localStorage.getItem("myToken")
              }
            }).then(res => {

              this.assignData(res)
              this.loading = false
            })

          } else {
            //是小伙伴操作
            this.$axios.get('/blog/' + id).then(res => {

              this.assignData(res)
              this.loading = false
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
