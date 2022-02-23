<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="搜索查询">
        <el-input v-model="webHits" placeholder="关键词" clearable @keyup.enter.native="searchWeb"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchWeb">搜索</el-button>
        <el-button type="primary" @click="dialogVisible = true">添加</el-button>
        <a style="margin-left: 10px; font-size: medium" :href="'javascript:(function(){var site=%27http://81.68.192.120/sys/webs?title=%27+encodeURIComponent(document.title)+%27&url=%27+encodeURIComponent(document.URL)+%27&token=%27+%27' + token  + '%27;var win=window.open(site,%27_blank%27);win.focus();})()'">收藏我吧！(拖拽到收藏栏)</a>
      </el-form-item>
    </el-form>

    <div class="wrapper">
      <div class="wrapper-content" v-for="web in webs">
        <el-card class="box-card" style="height: 100%" v-loading="loading">
          <div slot="header" class="clearfix">
            <el-link @click="go(web.link)">{{ web.title }}</el-link>
            <el-button style="float: right; padding: 3px 0" type="text" @click="editWeb(web.id)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="delWeb(web.id)">
              <el-button style="float: right;padding: 3px 0" type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </div>
          <div class="text item">
            {{ web.description }}
          </div>
          <div style="font-size: 14px">收藏时间：{{ web.created }}</div>
        </el-card>
      </div>
    </div>


    <el-dialog
        title="收藏状态"
        :visible.sync="infoVisible"
        width="600px"
        :before-close="infoHandleClose">

      <el-form :model="infoForm" :rules="infoFormRules" ref="infoForm" label-width="100px" class="demo-editForm">

        <el-form-item label="收藏标题" prop="title" label-width="100px">
          <el-input v-model="infoForm.title" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="收藏摘要" prop="description" label-width="100px">
          <el-input v-model="infoForm.description" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="收藏链接" prop="description" label-width="100px">
          <el-input v-model="infoForm.link" autocomplete="off" placeholder="https/http开头"></el-input>
        </el-form-item>


        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="infoForm.status">
            <el-radio :label=1>隐藏</el-radio>
            <el-radio :label=0>公开</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitInfoForm('infoForm')">创建</el-button>
          <el-button @click="resetForm('infoForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog
        title="添加收藏"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="收藏标题" prop="title" label-width="100px">
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="收藏摘要" prop="description" label-width="100px">
          <el-input v-model="editForm.description" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="收藏链接" prop="description" label-width="100px">
          <el-input v-model="editForm.link" autocomplete="off" placeholder="https/http开头"></el-input>
        </el-form-item>


        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=1>隐藏</el-radio>
            <el-radio :label=0>公开</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">创建</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-pagination class="mpage"
                   background
                   layout="prev, pager, next"
                   :current-page="currentPage"
                   :page-size="pageSize"
                   :total="total"
                   @current-change=pageSelect>
    </el-pagination>

  </div>
</template>

<script>
export default {
  name: "SystemWebs",
  data() {
    return {
      currentPage: 1,
      pageSize: 9,
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
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入描述', trigger: 'blur'}
        ],
        link: [
          {required: true, message: '请输入链接', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
      },

      editFormRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入描述', trigger: 'blur'}
        ],
        link: [
          {required: true, message: '请输入链接', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
      },
    }
  },

  created() {
    if (sessionStorage.getItem('myToken')) {
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
        this.$message.error("没有相关记录")
        this.loading = false
        return
      }

      this.webs = res.data.data.records
      this.currentPage = res.data.data.current
      this.total = res.data.data.total
      this.pageSize = res.data.data.size


      this.webs.forEach((item) => {
        item.created = item.created.replace('T', ' ')
      })
    },

    searchWeb() {
      if (this.webHits === '') {
        this.getWebList(1)
      } else {
        if (sessionStorage.getItem("myToken") && this.$store.state.myUserInfo.role === 'admin') {
          this.loading = true
          this.$axios.get('/searchWebsiteAuth/' + 1 + '?keyword=' + this.webHits, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
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
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
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
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.infoForm = res.data.data
        this.infoVisible = true
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/addWebsite', this.editForm, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
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
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
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

    pageSelect(currentPage) {
      if (this.webHits !== '') {
        if (sessionStorage.getItem('myToken')) {
          this.$axios.get('/searchWebsiteAuth/' + currentPage + '?keyword=' + this.webHits, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
            this.webs = res.data.data.records
            this.currentPage = res.data.data.current
            this.total = res.data.data.total
            this.pageSize = res.data.data.size

            this.webs.forEach((item) => {
              item.created = item.created.replace('T', ' ')
            })

            this.loading = false
          })
        } else {
          this.$axios.get('/searchWebsite/' + currentPage + '?keyword=' + this.webHits).then(res => {
            this.webs = res.data.data.records
            this.currentPage = res.data.data.current
            this.total = res.data.data.total
            this.pageSize = res.data.data.size

            this.webs.forEach((item) => {
              item.created = item.created.replace('T', ' ')
            })

            this.loading = false
          })
        }
      } else {
        this.getWebList(currentPage)
      }
    },

    editHandle(id) {
      this.$axios.get('/recoverBlogs/' + id + '/' + this.userId, {
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success',
          onClose:() => {
            this.getBlogList(1)
          }
        });
      })
    },


    getWebList(currentPage) {
      const _this = this

      this.loading = true

      this.$axios.get('/searchRecent/' + currentPage).then(res => {
        _this.webs = res.data.data.records
        _this.currentPage = res.data.data.current
        _this.total = res.data.data.total
        _this.pageSize = res.data.data.size

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

.mpage {
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
}

</style>
