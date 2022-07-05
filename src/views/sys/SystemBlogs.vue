<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="Search Query">
        <el-input v-model="searchBlogs" placeholder="Keyword" clearable @keyup.enter.native="getBlogList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBlogList">Search</el-button>
        <el-button type="primary" @click="addNewBlog">Add</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="Are you sure to delete in batch?" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatus">Delete Batch</el-button>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBlogToken">Read key</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
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
          width="100"
          align="center">
      </el-table-column>
      <el-table-column
          prop="username"
          label="Author"
          width="200"
          align="center">
      </el-table-column>
      <el-table-column
          prop="title"
          width="180"
          label="Title"
          align="center">
      </el-table-column>
      <el-table-column
          prop="description"
          label="Description"
          width="200"
          align="center">
      </el-table-column>

      <el-table-column
          prop="status"
          width="80"
          label="Status"
          align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 0" type="success">Normal</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 1" type="danger">Hidden</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="created"
          label="Created"
          width="140"
          align="center">
      </el-table-column>
      <el-table-column
          prop="content"
          label="Content"
          width="200"
          align="center">
      </el-table-column>

      <el-table-column
          prop="readRecent"
          label="Read"
          width="60"
          align="center">
      </el-table-column>

      <el-table-column
          prop="readSum"
          label="Read"
          width="100"
          align="center">
      </el-table-column>



      <el-table-column
          prop="icon"
          width="260"
          label="Operation"
          align="center"
          fixed="right">

        <template slot-scope="scope">
          <el-button type="text" @click="find(scope.row.id)">Check</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="editHandle(scope.row.id)" style="color: orange">Edit</el-button>
          <el-divider direction="vertical"></el-divider>


          <el-button type="text" @click="cooperate(scope.row.id)" style="color: lightseagreen">Co</el-button>

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm title="Are you sure to delete this blog？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference" style="color: indianred">Del</el-button>
            </el-popconfirm>
          </template>

          <el-divider direction="vertical"></el-divider>

          <el-button v-if="scope.row.status === 1" type="text" @click="statusHandle(scope.row.id, scope.row.status)" style="color: limegreen">Public</el-button>
          <el-button v-else-if="scope.row.status === 0" type="text" @click="statusHandle(scope.row.id, scope.row,status)" style="color: grey">Private</el-button>


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
        title="Please select the position"
        :visible.sync="coVisible"
        width="400px"
        :before-close="coHandleClose">

      <el-radio-group v-model="coNumber">
        <el-radio-button label="0" :disabled="coDisabled.index0" @click.native="elTarget"></el-radio-button>
        <el-radio-button label="1" :disabled="coDisabled.index1" @click.native="elTarget"></el-radio-button>
        <el-radio-button label="2" :disabled="coDisabled.index2" @click.native="elTarget"></el-radio-button>
      </el-radio-group>
      <div style="text-align: right">
        <el-button type="primary" :disabled="elGetTarget" @click="coConfirm">Get into</el-button>
      </div>
    </el-dialog>

    <Footer id="SBFooter"></Footer>

  </div>
</template>

<script>

import Footer from "@/components/Footer";
export default {
  name: "SystemBlogs",
  components: {Footer},
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
      this.$router.push('/public/blog/' + id)
    },

    getBlogToken() {
      const _this = this
      this.$axios.get('/getBlogToken', {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$alert(res.data.data, 'Read key', {
          confirmButtonText: 'Reset read key',
          callback: action => {
            if (action === 'confirm') {

              _this.$axios.get('/setBlogToken', {
                headers: {
                  "Authorization": localStorage.getItem("myToken")
                }
              }).then(res => {
                this.$message({
                  type: 'info',
                  message: `Read key set`
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
          message: 'Operation successful!',
          type: 'success',
          onClose:() => {
            this.getAllBlogs()
          }
        });
      })
    },


    addNewBlog() {
      this.$router.push({name: 'BlogAdd'})
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
          this.$message.error("No records")
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
          message: 'Operation successful!',
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

#SBFooter {
  margin-top: 5%;
}
</style>
