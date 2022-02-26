<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="搜索查询">
        <el-input v-model="searchUsersRole" placeholder="角色" clearable @keyup.enter.native="getUserList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList">搜索</el-button>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatus">批量删除</el-button>
        </el-popconfirm>
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
          label="用户名"
          width="90"
          align="center">
      </el-table-column>
      <el-table-column
          label="头像"
          width="50"
          align="center">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          width="180"
          align="center">
      </el-table-column>
      <el-table-column
          prop="monitor"
          width="70"
          label="监控"
          align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.monitor === 1" type="success">在线</el-tag>
          <el-tag size="small" v-else-if="scope.row.monitor === 0" type="danger">离线</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="status"
          width="70"
          label="状态"
          align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 1" type="danger">锁定</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="created"
          label="创建时间"
          width="150"
          align="center">
      </el-table-column>

      <el-table-column
          prop="lastLogin"
          label="上次登录"
          width="150"
          align="center">
      </el-table-column>

      <el-table-column
          prop="role"
          label="角色"
          width="80"
          align="center">
      </el-table-column>

      <el-table-column
          prop="icon"
          width="225"
          label="操作"
          align="center"
          fixed="right">

        <template slot-scope="scope">
          <el-button v-if="scope.row.monitor === 1 && scope.row.id !== 1" type="text" @click="roleKick(scope.row.id)">踢掉</el-button>
          <el-divider v-if="scope.row.monitor === 1 && scope.row.id !== 1" direction="vertical"></el-divider>
          <el-button type="text" @click="infoHandle(scope.row.id)">信息</el-button>
          <el-divider direction="vertical"></el-divider>


          <template>
            <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference" style="color: indianred;">删除</el-button>
            </el-popconfirm>
          </template>

          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="passwordHandle(scope.row.id)">密码</el-button>

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
        title="添加账号"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input v-model="editForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="password" label-width="100px">
          <el-input v-model="passwordConfirm" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role" label-width="100px">
          <el-input v-model="editForm.role" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像" prop="avatar" label-width="100px">
          <el-input v-model="editForm.avatar" placeholder="输入网址链接" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=1>禁用</el-radio>
            <el-radio :label=0>正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">创建</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>



    <el-dialog
        title="账号状态"
        :visible.sync="infoVisible"
        width="600px"
        :before-close="infoHandleClose">

      <el-form :model="infoForm" :rules="infoFormRules" ref="infoForm" label-width="100px" class="demo-editForm">

        <el-form-item v-show="false" label="id" prop="id" label-width="100px">
          <el-input v-model="infoForm.id" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input :disabled="true" v-model="infoForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role" label-width="100px">
          <el-input v-model="infoForm.role" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像" prop="avatar" label-width="100px">
          <el-input v-model="infoForm.avatar" placeholder="输入网址链接" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="infoForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="infoForm.status">
            <el-radio :label=1>锁定</el-radio>
            <el-radio :label=0>正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitInfoForm('infoForm')">创建</el-button>
          <el-button @click="resetForm('infoForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog
        title="修改密码"
        :visible.sync="passwordVisible"
        width="600px"
        :before-close="passwordHandleClose">

      <el-form :model="passwordForm" :rules="passwordFormRules" ref="passwordForm" label-width="100px" class="demo-editForm">

        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input :disabled="true" v-model="passwordForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input v-model="passwordForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="password" label-width="100px">
          <el-input v-model="passwordConfirm" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitPasswordForm('passwordForm')">创建</el-button>
          <el-button @click="resetForm('passwordForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "SystemUsers",
  data() {
    return {
      searchUsersRole: '',
      multipleSelection: [],
      tableData: [],
      passwordConfirm: '',
      dialogVisible: false,
      passwordVisible: false,
      infoVisible: false,
      delBtlStatus: true,
      status: 1,
      loading: false,

      editForm: {},
      passwordForm: {},
      infoForm: {},

      total: 0,
      size: 5,
      current: 1,

      editFormRules: {
        username: [
          {required: true, message: '请输入唯一用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请输入角色', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
      },

      infoFormRules: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请输入角色', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
      },
      passwordFormRules: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
      },
    }
  },

  created() {
    this.getUserList()
  },

  methods: {

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.passwordConfirm !== this.editForm.password) {
            this.$message({
              showClose: false,
              message: '密码输入不同',
              type: 'warning'
            })
            return false
          }
          this.$axios.post('/addUser', this.editForm, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
                this.$message({
                  showClose: true,
                  message: '操作成功',
                  type: 'success',
                  onClose:() => {
                    this.getUserList()
                  }
                });
                this.dialogVisible = false
                this.resetForm(formName)
                this.passwordConfirm = ''
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    submitPasswordForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.passwordConfirm !== this.passwordForm.password) {
            this.$message({
              showClose: false,
              message: '密码输入不同',
              type: 'warning'
            })
            return false
          }
          this.$axios.post('/modifyPassword', this.passwordForm, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success',
              onClose:() => {
                this.getUserList()
              }
            });
            this.passwordVisible = false
            this.resetForm(formName)
            this.passwordConfirm = ''
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
          this.$axios.post('/addUser', this.infoForm, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success',
              onClose:() => {
                this.getUserList()
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

    passwordHandleClose() {
      this.resetForm('passwordForm')
      this.passwordVisible = false
    },

    roleKick(id) {
      this.$axios.get('/roleKick/' + id, {
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success',
          onClose:() => {
            this.getUserList()
          }
        });
      })

    },

    infoHandle (id) {

      this.$axios.get('/getInfoById/' + id, {
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.infoForm = res.data.data
        this.infoVisible = true
      })
    },
    passwordHandle(id) {
      this.$axios.get('/getInfoById/' + id, {
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.passwordForm = res.data.data
        this.passwordVisible = true
      })
    },

    getUserList() {
      this.loading = true
      this.$axios.get("/queryUsers", {
        params: {
          role: this.searchUsersRole,
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

        this.loading = false

      })
    },
    handleSizeChange(val) {
      this.current = 1
      console.log(`每页 ${val}条`);
      this.size = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getUserList()
    },

    delHandle(id) {


      const ids = [];

      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }
      this.$axios.post("/deleteUsers", ids, {
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success',
          onClose:() => {

            if ((this.current - 1) * this.size + 1 === this.total) {
              this.current--;
            }

            this.getUserList()
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
