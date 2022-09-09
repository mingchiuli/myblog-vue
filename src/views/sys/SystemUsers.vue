<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item label="Search Query">
        <el-input v-model="searchUsersRole" placeholder="role" clearable @keyup.enter.native="getUserList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList">Search</el-button>
        <el-button type="primary" @click="dialogVisible = true">Add</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="Are you sure to delete in batch？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatus">Delete Batch</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
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
          width="100"
          align="center">
      </el-table-column>
      <el-table-column
          prop="username"
          label="Username"
          width="200"
          align="center">
      </el-table-column>
      <el-table-column
          label="Ava"
          width="50"
          align="center">
        <template #default="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
          prop="email"
          label="Email"
          width="180"
          align="center">
      </el-table-column>
      <el-table-column
          prop="monitor"
          width="75"
          label="Monitor"
          align="center">
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.monitor === 1" type="success">Online</el-tag>
          <el-tag size="small" v-else-if="scope.row.monitor === undefined || scope.row.monitor === 0" type="danger">Outline</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="status"
          width="80"
          label="Status"
          align="center">
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.status === 0" type="success">Normal</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 1" type="danger">Locked</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="created"
          label="Timestamp"
          width="145"
          align="center">
      </el-table-column>

      <el-table-column
          prop="lastLogin"
          label="Last Login"
          width="145"
          align="center">
      </el-table-column>

      <el-table-column
          prop="role"
          label="Role"
          width="75"
          align="center">
        <template #default="scope">
          <el-tag size="small" type="primary">{{ scope.row.role }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="icon"
          width="355"
          label="Operation"
          align="center"
          fixed="right">

        <template #default="scope">
          <el-button v-if="scope.row.monitor === 1 && scope.row.id !== 1" type="text" @click="roleKick(scope.row.id)">Kick</el-button>
          <el-divider v-if="scope.row.monitor === 1 && scope.row.id !== 1" direction="vertical"></el-divider>
          <el-button type="text" @click="infoHandle(scope.row.id)">Info</el-button>
          <el-divider direction="vertical"></el-divider>


          <template>
            <el-popconfirm title="Are you sure to delete?" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference" style="color: indianred;">Del</el-button>
            </el-popconfirm>
          </template>

          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="passwordHandle(scope.row.id)">Token</el-button>

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
        title="Add Profile"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="Username" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password" label-width="100px">
          <el-input v-model="editForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Confirm" prop="password" label-width="100px">
          <el-input v-model="passwordConfirm" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Role" prop="role" label-width="100px">
<!--          <el-input v-model="editForm.role" autocomplete="off"></el-input>-->

          <el-select v-model="editForm.role" placeholder="Please select">
            <el-option
                v-for="item in roleList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="Avatar" prop="avatar" label-width="100px">
          <el-input v-model="editForm.avatar" placeholder="Enter the link" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="Status" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=1>Disable</el-radio>
            <el-radio :label=0>Normal</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Submit</el-button>
          <el-button @click="resetForm('editForm')">Reset</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>



    <el-dialog
        title="Profile Status"
        :visible.sync="infoVisible"
        width="600px"
        :before-close="infoHandleClose">

      <el-form :model="infoForm" :rules="infoFormRules" ref="infoForm" label-width="100px" class="demo-editForm">

        <el-form-item v-show="false" label="id" prop="id" label-width="100px">
          <el-input v-model="infoForm.id" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Username" prop="username" label-width="100px">
          <el-input :disabled="true" v-model="infoForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Role" prop="role" label-width="100px">

          <el-select v-model="infoForm.role" placeholder="Please select">
            <el-option
                v-for="item in roleList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
            </el-option>
          </el-select>

<!--          <el-input v-model="infoForm.role" autocomplete="off"></el-input>-->
        </el-form-item>

        <el-form-item label="Avatar" prop="avatar" label-width="100px">
          <el-input v-model="infoForm.avatar" placeholder="Enter the link" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email" label-width="100px">
          <el-input v-model="infoForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Status" prop="status" label-width="100px">
          <el-radio-group v-model="infoForm.status">
            <el-radio :label=1>Locked</el-radio>
            <el-radio :label=0>Normal</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitInfoForm('infoForm')">Submit</el-button>
          <el-button @click="resetForm('infoForm')">Reset</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog
        title="Modify Password"
        :visible.sync="passwordVisible"
        width="600px"
        :before-close="passwordHandleClose">

      <el-form :model="passwordForm" :rules="passwordFormRules" ref="passwordForm" label-width="100px" class="demo-editForm">

        <el-form-item label="Username" prop="username" label-width="100px">
          <el-input :disabled="true" v-model="passwordForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password" label-width="100px">
          <el-input v-model="passwordForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Confirm" prop="password" label-width="100px">
          <el-input v-model="passwordConfirm" type="password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitPasswordForm('passwordForm')">Submit</el-button>
          <el-button @click="resetForm('passwordForm')">Reset</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <Footer id="SUFooter"></Footer>


  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "SystemUsers",
  components: {Footer},
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


      roleSelected: '',
      roleList: [],


      editForm: {},
      passwordForm: {},
      infoForm: {},

      total: 0,
      size: 5,
      current: 1,

      editFormRules: {
        username: [
          {required: true, message: 'Please enter the unique username', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'Please enter password', trigger: 'blur'}
        ],
        status: [
          {required: true, message: 'Please select status', trigger: 'blur'}
        ],
        role: [
          {required: true, message: 'Please enter role', trigger: 'blur'}
        ],
        email: [
          {required: true, message: 'Please enter email', trigger: 'blur'}
        ],
      },

      infoFormRules: {
        password: [
          {required: true, message: 'Please enter password', trigger: 'blur'}
        ],
        status: [
          {required: true, message: 'Please select status', trigger: 'blur'}
        ],
        role: [
          {required: true, message: 'Please enter role', trigger: 'blur'}
        ],
        email: [
          {required: true, message: 'Please enter email', trigger: 'blur'}
        ],
      },
      passwordFormRules: {
        password: [
          {required: true, message: 'Please enter password', trigger: 'blur'}
        ],
      },
    }
  },

  created() {
    this.getUserList()
    this.getRoleList()
  },

  methods: {

    getRoleList() {
      this.$axios.get('sys/role/list', {params: {
          name: '',
          current: 1,
          size: 99
        },
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.roleList = res.data.data.records
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.passwordConfirm !== this.editForm.password) {
            this.$message({
              showClose: false,
              message: 'Password input is different',
              type: 'warning'
            })
            return false
          }
          this.$axios.post('/addUser', this.editForm, {
            headers: {
              "Authorization": localStorage.getItem("myToken")
            }
          }).then(res => {
                this.$message({
                  showClose: true,
                  message: 'Operation successful',
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
              message: 'Password input is different',
              type: 'warning'
            })
            return false
          }
          this.$axios.post('/modifyPassword', this.passwordForm, {
            headers: {
              "Authorization": localStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: 'Operation successful',
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
              "Authorization": localStorage.getItem("myToken")
            }
          }).then(res => {
            this.$message({
              showClose: true,
              message: 'Operation successful',
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
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: 'Operation successful',
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
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.infoForm = res.data.data
        this.infoVisible = true
      })
    },
    passwordHandle(id) {
      this.$axios.get('/getInfoById/' + id, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
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
          "Authorization": localStorage.getItem("myToken")
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
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: 'Operation successful',
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

#SUFooter {
  margin-top: 5%;
}

</style>
