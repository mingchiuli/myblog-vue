<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="Search">
        <el-input v-model="webHits" placeholder="Keyword" clearable @keyup.enter.native="searchWeb"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchWeb">Search</el-button>
        <el-button type="primary" @click="dialogVisible = true">Add</el-button>
        <a id="SWA" :href="'javascript:(function(){var site=%27http://119.91.233.182/sys/webs?title=%27+encodeURIComponent(document.title)+%27&url=%27+encodeURIComponent(document.URL)+%27&token=%27+%27' + token  + '%27;var win=window.open(site,%27_blank%27);win.focus();})()'">Collect me ！(Drag to browser favorites bar)</a>
      </el-form-item>
    </el-form>

    <div class="wrapper">
      <div class="wrapper-content" v-for="web in webs">
        <el-card class="box-card" v-loading="loading">
          <div slot="header" class="clearfix">
            <el-link @click="go(web.link)">{{ web.title }}</el-link>
            <el-button class="SWButton" type="text" @click="editWeb(web.id)">Edit</el-button>
            <el-popconfirm title="Are you sure to delete？" @confirm="delWeb(web.id)">
              <el-button class="SWButton" type="text" slot="reference">Delete</el-button>
            </el-popconfirm>
          </div>
          <div class="text item">
            {{ web.description }}
          </div>
          <div class="SWContent">Time stamp：{{ web.created }}</div>
          <br v-if="web.score !== undefined"/>
          <div class="SWContent" v-if="web.score !== undefined">{{"Search Scores：" + web.score}}</div>
          <p class="SWContent" v-html="web.highlight" v-if="web.highlight !== undefined"></p>
        </el-card>
      </div>
    </div>


    <el-dialog
        title="Status"
        :visible.sync="infoVisible"
        width="600px"
        :before-close="infoHandleClose">

      <el-form :model="infoForm" :rules="infoFormRules" ref="infoForm" label-width="100px" class="demo-editForm">

        <el-form-item label="Title" prop="title" label-width="100px">
          <el-input v-model="infoForm.title" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="Description" prop="description" label-width="100px">
          <el-input v-model="infoForm.description" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Link" prop="description" label-width="100px">
          <el-input v-model="infoForm.link" autocomplete="off" placeholder="https/http开头"></el-input>
        </el-form-item>


        <el-form-item label="Status" prop="status" label-width="100px">
          <el-radio-group v-model="infoForm.status">
            <el-radio :label=1>Private</el-radio>
            <el-radio :label=0>Public</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitInfoForm('infoForm')">Submit</el-button>
          <el-button @click="resetForm('infoForm')">Reset</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog
        title="Add"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="Title" prop="title" label-width="100px">
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="Description" prop="description" label-width="100px">
          <el-input v-model="editForm.description" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Link" prop="description" label-width="100px">
          <el-input v-model="editForm.link" autocomplete="off" placeholder="https/http开头"></el-input>
        </el-form-item>


        <el-form-item label="Status" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=1>Private</el-radio>
            <el-radio :label=0>Public</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Submit</el-button>
          <el-button @click="resetForm('editForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-pagination class="mPage"
                   background
                   layout="prev, pager, next"
                   :current-page="current"
                   :page-size="size"
                   :total="total"
                   @current-change=pageSelect>
    </el-pagination>

    <Footer id="SWFooter"></Footer>

  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "SystemWebs",
  components: {Footer},
  data() {
    return {
      current: 1,
      size: 9,
      webHits: '',
      loading: false,
      total: 0,
      token: '',


      dialogVisible: false,
      infoVisible: false,

      webs: {},

      editForm: {
        title: '',
        description: '',
        link: '',
        status: 0
      },
      infoForm: {},

      infoFormRules: {
        title: [
          {required: true, message: 'Please enter the title', trigger: 'blur'}
        ],
        description: [
          {required: true, message: 'Please enter the description', trigger: 'blur'}
        ],
        link: [
          {required: true, message: 'Please enter the link', trigger: 'blur'}
        ],
        status: [
          {required: true, message: 'Please enter the status', trigger: 'blur'}
        ],
      },

      editFormRules: {
        title: [
          {required: true, message: 'Please enter the title', trigger: 'blur'}
        ],
        description: [
          {required: true, message: 'Please enter the description', trigger: 'blur'}
        ],
        link: [
          {required: true, message: 'Please enter the link', trigger: 'blur'}
        ],
        status: [
          {required: true, message: 'Please enter the status', trigger: 'blur'}
        ],
      },
    }
  },

  created() {
    if (localStorage.getItem('myToken')) {
      this.$store.state.hasLogin = true
    }

    if (this.$route.query.url && this.$route.query.title) {

      this.editForm.link = this.$route.query.url
      this.editForm.title = this.$route.query.title
      sessionStorage.setItem("myToken", this.$route.query.token)
    }

    this.$axios.get('/getJWT').then(res => {

      console.log(res)
      this.token = res.data.data
    })

    this.getWebList(1)
  },

  methods: {

    searchWebCommon(res) {

      if (res.data.data.total === 0) {
        this.webHits = ''
        this.searchWeb()
        this.$message.error("No Records")
        this.loading = false
        return
      }

      this.webs = res.data.data.records
      this.current = res.data.data.current
      this.total = res.data.data.total
      this.size = res.data.data.size


      this.webs.forEach((item) => {
        item.created = item.created.replace('T', ' ')
      })
    },

    searchWeb() {
      if (this.webHits === '') {
        this.getWebList(1)
      } else {
        if (localStorage.getItem("myToken") && this.$store.state.myUserInfo.role === 'admin') {
          this.loading = true
          this.$axios.get('/searchWebsiteAuth/' + 1 + '?keyword=' + this.webHits, {
            headers: {
              "Authorization": localStorage.getItem("myToken")
            }
          }).then(res => {

            this.searchWebCommon(res)
            this.loading = false
          })
        } else {
          this.loading = true
          this.$axios.get('/searchWebsite/' + 1 + '?keyword=' + this.webHits).then(res => {
            this.searchWebCommon(res)
            this.loading = false
          })
        }
      }
    },

    delWeb(id) {
      this.$axios.get('/deleteWebsite/' + id, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: 'Operation Successful!',
          type: 'success',
          duration: 3 * 1000,
          onClose:() => {
            this.getWebList(1)
          }
        });
      })
    },

    editWeb(id) {
      this.$axios.get('/getWebInfo/' + id, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.infoForm = res.data.data
        this.infoVisible = true
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let token = ''
          if (localStorage.getItem("myToken")) {
            token = localStorage.getItem("myToken")
          } else {
            token = sessionStorage.getItem("myToken")
          }

          this.$axios.post('/addWebsite', this.editForm, {
            headers: {
              "Authorization": token
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: 'Operation Successful!',
              type: 'success',
              duration: 3 * 1000,
              onClose:() => {
                this.getWebList(1)
              }
            });
            this.dialogVisible = false
            this.resetForm(formName)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

     submitInfoForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/modifyWebsite', this.infoForm, {
            headers: {
              "Authorization": localStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: 'Operation Successful!',
              type: 'success',
              duration: 3 * 1000,
              onClose:() => {
                this.getWebList(1)
              }
            });
            this.infoVisible = false
            this.resetForm(formName)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },


    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.editForm = {}
      this.infoForm = {}
      this.passwordForm = {}
    },

    handleClose() {
      this.resetForm('editForm')
      this.dialogVisible = false
    },

    infoHandleClose() {
      this.resetForm('infoForm')
      this.infoVisible = false
    },

    go(link) {
      window.open().location.href = link
    },

    pageSelect(current) {
      if (this.webHits !== '') {
        if (localStorage.getItem('myToken')) {
          this.$axios.get('/searchWebsiteAuth/' + current + '?keyword=' + this.webHits, {
            headers: {
              "Authorization": localStorage.getItem("myToken")
            }
          }).then(res => {
            this.webs = res.data.data.records
            this.current = res.data.data.current
            this.total = res.data.data.total
            this.size = res.data.data.size

            this.webs.forEach((item) => {
              item.created = item.created.replace('T', ' ')
            })

            this.loading = false
          })
        } else {
          this.$axios.get('/searchWebsite/' + current + '?keyword=' + this.webHits).then(res => {
            this.webs = res.data.data.records
            this.current = res.data.data.current
            this.total = res.data.data.total
            this.size = res.data.data.size

            this.webs.forEach((item) => {
              item.created = item.created.replace('T', ' ')
            })

            this.loading = false
          })
        }
      } else {
        this.getWebList(current)
      }
    },

    editHandle(id) {
      this.$axios.get('/recoverBlogs/' + id + '/' + this.userId, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: 'Operation Successful!',
          type: 'success',
          onClose:() => {
            this.getBlogList(1)
          }
        });
      })
    },


    getWebList(current) {
      const _this = this

      this.loading = true

      this.$axios.get('/searchRecent/' + current).then(res => {
        _this.webs = res.data.data.records
        _this.current = res.data.data.current
        _this.total = res.data.data.total
        _this.size = res.data.data.size

        for (let i = 0; i < _this.webs.length; i++) {
          _this.webs[i].created = _this.webs[i].created.replace('T', ' ')
        }

        this.loading = false
      })
    },

  }
}
</script>

<style scoped>

.mPage {
  margin: 0 auto;
  text-align: center;
}

.wrapper{
  width: 100%;
  margin-top: 0;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
}
.wrapper-content{
  width: 30%;
  margin:20px 0;
  /*height: 30%;*/
}


.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  height: 100%;
}

#SWFooter {
  margin-top: 5%;
}

#SWA {
  margin-left: 10px;
  font-size: medium;
}

.SWButton {
  float: right;
  padding: 3px 0;
}

.SWContent {
  font-size: 14px;
}

</style>
