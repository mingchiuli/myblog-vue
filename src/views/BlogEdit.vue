<template>
  <div>
    <h2>Post</h2>

    <div class="m-content">

      <el-form :model="contentForm" :rules="rules" ref="contentForm" label-width="100px" class="demo-contentForm">
        <el-form-item class="uni" label="title" prop="title">
          <el-input v-model="contentForm.title"></el-input>
        </el-form-item>

<!--        el-form-item的prop="description"疑似没用-->
        <el-form-item class="uni" label="description" prop="description">
          <el-input type="textarea" v-model="contentForm.description"></el-input>
        </el-form-item>

        <el-upload
            id="BEUpdate"
            action="#"
            class="upload-demo"
            :on-remove="removeCover"
            :file-list="fileList"
            :http-request="uploadCover"
            list-type="text">
          <el-button size="small" type="primary">Click to upload the cover</el-button>
        </el-upload>
        <br/>

        <el-image :src="fileList.length === 0 ? '' : fileList[0].url">
        </el-image>
        <div>Cover Preview</div>
        <br/>

        <div class="mRadio">
          <el-radio v-model="contentForm.status" label="0">公开</el-radio>
          <el-radio v-model="contentForm.status" label="1">加密</el-radio>
        </div>

        <div id="editor" v-loading="loading">
          <mavon-editor style="height: 100%" v-model="contentForm.content" :subfield="false" :ishljs = "true" ref="md" code-style="androidstudio" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
        </div>

        <el-form-item id="submit">
          <el-button type="primary" @click="submitForm('contentForm')">Submit</el-button>
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
          link: '',
          status: '',
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
      isPC() {
        let flag =  navigator.userAgent.match(/(phone|pod|iPhone|iPod|ios|Android|Moblie|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowerNG|WebOS|Symbian|Windows Phone)/i);
        return flag === null;
      },


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
        let blog = res.data.data
        this.contentForm.id = blog.id
        this.contentForm.title = blog.title
        this.contentForm.description = blog.description
        this.contentForm.content = blog.content
        this.contentForm.link = blog.link
        this.contentForm.status = blog.status.toString()
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
      if(blogId && localStorage.getItem("myUserInfo") && JSON.parse(localStorage.getItem("myUserInfo")).role === 'admin') {
        this.$axios.get('/blogAuthorized/' + blogId, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {

          this.assignData(res)

        })
        //是其他小伙伴操作
      } else if (blogId && localStorage.getItem("myUserInfo")) {
        this.$axios.get('/blog/' + blogId).then(res => {

          this.assignData(res)

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
          if (JSON.parse(localStorage.getItem("myUserInfo")).role === 'admin') {

            this.$axios.get('/blogAuthorized/' + id, {
              headers: {
                "Authorization": localStorage.getItem("myToken")
              }
            }).then(res => {

              this.assignData(res)
            })

          } else {
            //是小伙伴操作
            this.$axios.get('/blog/' + id).then(res => {

              this.assignData(res)
            })
          }
        })
      }

      setTimeout(() => {
        let ele = document.querySelector("#editor");

        if (this.isPC()) {
          ele.style.width = '50%'
        } else {
          ele.style.width = '300px'
        }
      }, 100)
      this.loading = false


    }
  }
</script>

<style scoped>
h2 {
  font-size: xx-large;
  margin-top: 5%;
  margin-bottom: 5%;
  text-align: center;
}

.el-form-item {
  max-width: 80%;
  margin-left: 7.5%;
}

.m-content {
  text-align: center;
}

.uni {
  margin: 2% auto;
  width: 50%;
  height: 100%;
}

#editor {
  margin: auto;
  width: 50%
}

#submit {
  margin-left: 37.5%;
}

#BEUpdate {
  width: 30%;
  margin-left: 35%;
}

.el-image {
  width: 30%;
}

.mRadio {
  margin-bottom: 15px;
}
</style>
