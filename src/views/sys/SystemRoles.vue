<template>
	<div>
		<el-form :inline="true" @submit.native.prevent>
			<el-form-item label="Search">
				<el-input
						v-model="searchForm.name"
						placeholder="Name"
						clearable
            @keyup.enter.native="getRoleList">

				</el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getRoleList">Search</el-button>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="dialogVisible = true">Add</el-button>
			</el-form-item>

			<el-form-item>
				<el-popconfirm title="Are you sure to delete in batch?" @confirm="delHandle(null)">
					<el-button type="danger" slot="reference" :disabled="delBtlStatus">Delete Batch</el-button>
				</el-popconfirm>
			</el-form-item>
		</el-form>

		<el-table
        v-loading="loading"
				ref="multipleTable"
				:data="tableData"
				tooltip-effect="dark"
				style="width: 100%"
				border
				stripe
				@selection-change="handleSelectionChange">

			<el-table-column
					type="selection"
					width="55"
          align="center">
			</el-table-column>

			<el-table-column
					prop="name"
					label="Name"
					width="120"
          align="center">
			</el-table-column>
			<el-table-column
					prop="code"
					label="Unique Code"
					show-overflow-tooltip
          align="center">
			</el-table-column>
			<el-table-column
					prop="remark"
					label="Remark"
					show-overflow-tooltip
          align="center">
			</el-table-column>

			<el-table-column
					prop="status"
					label="Status"
          align="center">
				<template slot-scope="scope">
					<el-tag size="small" v-if="scope.row.status === 0" type="success">Normal</el-tag>
					<el-tag size="small" v-else-if="scope.row.status === 1" type="danger">Disable</el-tag>
				</template>

			</el-table-column>
			<el-table-column
					prop="icon"
					label="Operation"
          align="center"
          fixed="right">

				<template slot-scope="scope">
					<el-button type="text" @click="permHandle(scope.row.id)" style="color: orange">Assign permissions</el-button>
					<el-divider direction="vertical"></el-divider>

					<el-button type="text" @click="editHandle(scope.row.id)">Edit</el-button>
					<el-divider direction="vertical"></el-divider>

					<template>
						<el-popconfirm title="Are you sure to delete？" @confirm="delHandle(scope.row.id)">
							<el-button type="text" slot="reference" style="color: indianred">Delete</el-button>
						</el-popconfirm>
					</template>

				</template>
			</el-table-column>

		</el-table>


		<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[5, 20, 50, 100]"
				:current-page="current"
				:page-size="size"
				:total="total">
		</el-pagination>


		<!--新增对话框-->
		<el-dialog
				title="提示"
				:visible.sync="dialogVisible"
				width="600px"
				:before-close="handleClose">

			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

				<el-form-item label="Role Name" prop="name" label-width="100px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="Unique Code" prop="code" label-width="100px">
					<el-input v-model="editForm.code" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="Remark" prop="remark" label-width="100px">
					<el-input v-model="editForm.remark" autocomplete="off"></el-input>
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
				title="Assign permissions"
				:visible.sync="permDialogVisible"
				width="600px">

			<el-form :model="permForm">

				<el-tree
						:data="permTreeData"
						show-checkbox
						ref="permTree"
						:default-expand-all=true
						node-key="menuId"
						:check-strictly=true
						:props="defaultProps">
				</el-tree>

			</el-form>

			<span slot="footer" class="dialog-footer">
			    <el-button @click="permDialogVisible = false">Cancel</el-button>
			    <el-button type="primary" @click="submitPermFormHandle('permForm')">Submit</el-button>
			</span>

		</el-dialog>

    <Footer></Footer>

	</div>
</template>

<script>
	import Footer from "@/components/Footer";
  export default {
		name: "SystemRoles",
    components: {Footer},
    data() {
			return {
        loading: false,
				searchForm: {},
				delBtlStatus: true,

				total: 0,
				size: 5,
				current: 1,

				dialogVisible: false,
				editForm: {

				},

				tableData: [],

				editFormRules: {
					name: [
						{required: true, message: 'Please enter the role name', trigger: 'blur'}
					],
					code: [
						{required: true, message: 'Please enter the unique code', trigger: 'blur'}
					],
					status: [
						{required: true, message: 'Please select status', trigger: 'blur'}
					]
				},

				multipleSelection: [],

				permDialogVisible: false,
				permForm: {},
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				permTreeData: []
			}
		},
		created() {
      this.loading = true
			this.getRoleList()

			this.$axios.get('/sys/menu/list', {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
				this.permTreeData = res.data.data
        this.loading = false
			})
		},
		methods: {
			handleSelectionChange(val) {
				console.log("勾选")
				console.log(val)
				this.multipleSelection = val;

				this.delBtlStatus = val.length === 0
			},

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.size = val
				this.getRoleList()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.current = val
				this.getRoleList()
			},

      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
        this.editForm = {}
      },
			handleClose() {
				this.resetForm('editForm')
			},

			getRoleList() {
        this.loading = true
				this.$axios.get("/sys/role/list", {
					params: {
						name: this.searchForm.name,
						current: this.current,
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

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm, {
              headers: {
                "Authorization": localStorage.getItem("myToken")
              }
            }).then(res => {
								this.$message({
									showClose: true,
									message: 'Operation successful!',
									type: 'success',
									onClose:() => {
										this.getRoleList()
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

			editHandle(id) {
				this.$axios.get('/sys/role/info/' + id, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
          console.log(res.data.data)

					this.editForm = res.data.data

					this.dialogVisible = true
				})
			},

			delHandle(id) {

				let ids = []

				if (id) {
					ids.push(id)
				} else {
					this.multipleSelection.forEach(row => {
						ids.push(row.id)
					})
				}

				this.$axios.post("/sys/role/delete", ids, {
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

							this.getRoleList()
						}
					});
				})
			},


			permHandle(id) {
				this.permDialogVisible = true

				this.$axios.get("/sys/role/info/" + id, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {

          console.log(res.data.data.menuIds)
					this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
					this.permForm = res.data.data

				})
			},

			submitPermFormHandle(formName) {
				let menuIds = this.$refs.permTree.getCheckedKeys()

				console.log(menuIds)

				this.$axios.post('/sys/role/perm/' + this.permForm.id, menuIds, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
					this.$message({
						showClose: true,
						message: 'Operation successful!',
						type: 'success',
						onClose:() => {
							this.getRoleList()
						}
					});
					this.permDialogVisible = false
					this.resetForm(formName)
				})
			}
		}
	}
</script>

<style scoped>

	.el-pagination {
		float: right;
		margin-top: 22px;
	}

</style>
