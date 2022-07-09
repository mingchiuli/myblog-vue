<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="Search">
        <el-input v-model="searchBlogsTitle" placeholder="Title Keyword" clearable @keyup.enter.native="getBlogList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBlogList">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        border
        stripe>

      <el-table-column
          prop="id"
          label="id"
          width="60"
          align="center">
      </el-table-column>
      <el-table-column
          prop="username"
          label="author"
          width="90"
          align="center">
      </el-table-column>
      <el-table-column
          prop="title"
          width="150"
          label="Title"
          align="center">
      </el-table-column>
      <el-table-column
          prop="description"
          label="Description"
          width="250"
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
          width="485"
          align="center">
      </el-table-column>

      <el-table-column
          prop="icon"
          width="200"
          label="Operation"
          align="center"
          fixed="right">

        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)">Resume</el-button>
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

    <Footer style="margin-top: 5%"></Footer>

  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "SystemDeleted",
  components: {Footer},
  data() {
    return {
      searchBlogsTitle: '',
      tableData: [],
      userId: 0,
      loading: false,

      total: 0,
      size: 5,
      current: 1,
    }
  },

  created() {
    this.userId = this.$store.state.myUserInfo.id
    this.getBlogList()
  },

  methods: {

    editHandle(id) {
      this.$axios.get('/recoverBlogs/' + id + '/' + this.userId, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: 'Operation successful!',
          type: 'success',
          onClose:() => {
            this.getBlogList()
          }
        });
      })
    },


    getBlogList() {
      this.loading = true

      this.$axios.get("/queryDeletedBlogs", {
        params: {
          userId: this.userId,
          title: this.searchBlogsTitle,
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
          item.content = item.content.substring(0, 20) + '...'
          item.created = item.created.toString().replace('T', ' ')
        })

        this.loading = false

      })
    },
    handleSizeChange(val) {
      this.current = 1
      console.log(`每页 ${val}条`);
      this.size = val
      this.getBlogList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getBlogList()
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
            this.getBlogList()
          }
        });
      })
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
