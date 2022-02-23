<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="搜索查询">
        <el-input v-model="searchBlogsTitle" placeholder="标题关键字" clearable @keyup.enter.native="getBlogList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBlogList">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
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
          label="作者"
          width="90"
          align="center">
      </el-table-column>
      <el-table-column
          prop="title"
          width="120"
          label="标题"
          align="center">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述"
          width="180"
          align="center">
      </el-table-column>

      <el-table-column
          prop="status"
          width="70"
          label="状态"
          align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 1" type="danger">隐藏</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="created"
          label="删除时间"
          width="150"
          align="center">
      </el-table-column>
      <el-table-column
          prop="content"
          label="内容"
          width="405"
          align="center">
      </el-table-column>

      <el-table-column
          prop="icon"
          width="100"
          label="操作"
          align="center"
          fixed="right">

        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)">恢复</el-button>
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

  </div>
</template>

<script>
export default {
  name: "SystemDeleted",
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
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
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
          "Authorization": sessionStorage.getItem("myToken")
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
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
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
