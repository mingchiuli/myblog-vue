<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="搜索查询">
        <el-input v-model="searchBlogs" placeholder="关键词" clearable @keyup.enter.native="getBlogList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBlogList">搜索</el-button>
        <el-button type="primary" @click="addNewBlog">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatus">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBlogToken">阅读密钥</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange">

<!--      v-model="delBtlStatus"和label="false"在这里没什么用-->
      <el-table-column
          v-model="delBtlStatus"
          label="false"
          type="selection"
          width="50">
      </el-table-column>

      <el-table-column
          prop="id"
          label="id"
          width="60"
          align="center">
      </el-table-column>
      <el-table-column
          prop="username"
          label="作者"
          width="90"
          align="center">
      </el-table-column>
      <el-table-column
          prop="title"
          width="80"
          label="标题"
          align="center">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述"
          width="110"
          align="center">
      </el-table-column>

      <el-table-column
          prop="status"
          width="65"
          label="状态"
          align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 1" type="danger">隐藏</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="created"
          label="创建时间"
          width="140"
          align="center">
      </el-table-column>
      <el-table-column
          prop="content"
          label="内容"
          width="190"
          align="center">
      </el-table-column>

      <el-table-column
          prop="readRecent"
          label="近期"
          width="50"
          align="center">
      </el-table-column>

      <el-table-column
          prop="readSum"
          label="总阅读"
          width="80"
          align="center">
      </el-table-column>



      <el-table-column
          prop="icon"
          width="260"
          label="操作"
          align="center"
          fixed="right">

        <template slot-scope="scope">
          <el-button type="text" @click="find(scope.row.id)">查看</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="editHandle(scope.row.id)" style="color: orange">编辑</el-button>
          <el-divider direction="vertical"></el-divider>


          <el-button type="text" @click="cooperate(scope.row.id)" style="color: lightseagreen">协同</el-button>

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm title="确定删除此博客吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference" style="color: indianred">删除</el-button>
            </el-popconfirm>
          </template>

          <el-divider direction="vertical"></el-divider>

          <el-button v-if="scope.row.status === 1" type="text" @click="statusHandle(scope.row.id, scope.row.status)" style="color: limegreen">公开</el-button>
          <el-button v-else-if="scope.row.status === 0" type="text" @click="statusHandle(scope.row.id, scope.row,status)" style="color: grey">隐藏</el-button>


        </template>
      </el-table-column>


    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50]"
        :current-page="current"
        :page-size="size"
        :total="total">
    </el-pagination>


    <el-dialog
        title="请选择位次: 编号越小，编辑区域越靠前"
        :visible.sync="coVisible"
        width="400px"
        :before-close="coHandleClose">

      <el-radio-group v-model="coNumber">
        <el-radio-button label="0" :disabled="coDisabled.index0" @click.native="elTarget"></el-radio-button>
        <el-radio-button label="1" :disabled="coDisabled.index1" @click.native="elTarget"></el-radio-button>
        <el-radio-button label="2" :disabled="coDisabled.index2" @click.native="elTarget"></el-radio-button>
      </el-radio-group>
      <div style="text-align: right">
        <el-button type="primary" :disabled="elGetTarget" @click="coConfirm">进入</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: "SystemBlogs",
  data() {
    return {
      search: false,
      searchBlogs: '',
      multipleSelection: [],
      delBtlStatus: true,
      tableData: [],
      coVisible: false,
      coNumber: -1,
      coBlogId: 0,
      coDisabled: {},
      elGetTarget: true,
      loading: false,

      total: 0,
      size: 5,
      current: 1,
    }
  },

  created() {
    this.getAllBlogs()
  },

  methods: {

    getAllBlogs() {
      this.loading = true
      this.$axios.get("/getAllBlogs", {
        params: {
          currentPage: this.current,
          size: this.size
        },
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {

        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total

        this.tableData.forEach((item) => {
          item.description = item.description.substring(0, 15) + '...'
          item.content = item.content + '...'
          item.created = item.created.toString().replace('T', ' ')
        })

        this.loading = false

      })
    },

    find(id) {
      this.$router.push('/blog/' + id)
    },

    getBlogToken() {
      const _this = this
      this.$axios.get('/getBlogToken', {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$alert(res.data.data, '阅读密钥', {
          confirmButtonText: '重置阅读密钥',
          callback: action => {
            if (action === 'confirm') {

              _this.$axios.get('/setBlogToken', {
                headers: {
                  "Authorization": localStorage.getItem("myToken")
                }
              }).then(res => {
                this.$message({
                  type: 'info',
                  message: `阅读密钥已设置`
                });
              })

            }
          }
        });
      })
    },

    elTarget() {
      this.elGetTarget = false
    },

    coHandleClose() {
      this.coVisible = false
    },

    coConfirm() {
      this.$router.push('/cooperate/' + this.coBlogId + '/' + this.coNumber)
    },

    cooperate(id) {

      const _this = this
      this.$axios.get('/coStatus/' + id, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        _this.coDisabled = res.data.data
        this.coBlogId = id;
        this.coVisible = true;
      })
    },

    statusHandle(id, status) {
      if (status === 1) {
        status = 0
      } else {
        status = 1
      }
      this.$axios.get('/modifyBlogStatus/' + id + '/' + status, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success',
          onClose:() => {
            this.getAllBlogs()
          }
        });
      })
    },


    addNewBlog() {
      this.$router.push('/blog/add')
    },

    editHandle (id) {
      this.$router.push({name: 'BlogEdit', params: {blogId: id}})
    },

    getBlogList() {

      this.search = this.searchBlogs !== '';

      this.loading = true
      this.$axios.get("/queryBlogs", {
        params: {
          keyword: this.searchBlogs,
          currentPage: this.current,
          size: this.size
        },
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {

        if (res.data.data.records.total === 0) {
          this.searchBlogs = ''
          this.getAllBlogs()
          this.$message.error("没有相关记录")
          this.loading = false
          return
        }

        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total

        this.tableData.forEach((item) => {
          item.description = item.description.substring(0, 15) + '...'
          item.content = item.content + '...'
          item.created = item.created.toString().replace('T', ' ')
        })

        this.loading = false

      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val}条`);
      this.current = 1
      this.size = val

      if (this.search) {
        this.getBlogList()
      } else {
        this.getAllBlogs()
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      if (this.search) {
        this.getBlogList()
      } else {
        this.getAllBlogs()
      }
    },

    delHandle(id) {
      const ids = [];

      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
          console.log(row.id)
        })
      }

      this.$axios.post("/deleteBlogs", ids, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose:() => {

            if ((this.current - 1) * this.size + 1 === this.total) {
              this.current--;
            }

            this.getAllBlogs()
          }
        });
      })
    },
    handleSelectionChange(val) {
      console.log("勾选")
      console.log(val)
      this.multipleSelection = val;

      this.delBtlStatus = val.length === 0
    },
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 1%;
}


</style>
