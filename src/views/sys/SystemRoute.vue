<template>
	<div>

		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="dialogVisible = true">Add</el-button>
			</el-form-item>
		</el-form>

		<el-table
        v-loading="loading"
				:data="tableData"
        row-key="menuId"
				border
				stripe
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
<!--      hasChildren在tableData没有也可以先写上-->

			<el-table-column
					prop="title"
					label="Title"
					sortable
					width="180"
          align="center">
			</el-table-column>

			<el-table-column
					prop="icon"
					label="Icon"
          align="center">
			</el-table-column>

			<el-table-column
					prop="type"
					label="Type"
          align="center">
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.type === 0">Catalogue</el-tag>
					<el-tag size="small" v-else-if="scope.row.type === 1" type="success">Menu</el-tag>
					<el-tag size="small" v-else-if="scope.row.type === 2" type="info">Route</el-tag>
				</template>

			</el-table-column>

			<el-table-column
					prop="url"
					label="Item URL"
          align="center">
			</el-table-column>
			<el-table-column
					prop="component"
					label="Component"
          align="center">
			</el-table-column>
			<el-table-column
					prop="orderNum"
					label="Order Number"
          align="center">
			</el-table-column>
			<el-table-column
					prop="status"
					label="Status"
          align="center">
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.status === 0" type="success">Normal</el-tag>
					<el-tag size="small" v-else-if="scope.row.status === 1" type="danger">Disable</el-tag>
				</template>

			</el-table-column>
			<el-table-column
					prop="icon"
					label="Operation"
          align="center"
          fixed="right">

				<template #default="scope">
					<el-button type="text" @click="editHandle(scope.row.menuId)">Edit</el-button>
					<el-divider direction="vertical"></el-divider>

					<template>
						<el-popconfirm title="Are you sure to delete？" @confirm="delHandle(scope.row.menuId)">
							<el-button type="text" slot="reference" style="color: indianred">Delete</el-button>
						</el-popconfirm>
					</template>

				</template>
			</el-table-column>

		</el-table>


		<!--新增对话框-->
		<el-dialog
				title="Prompt"
				:visible.sync="dialogVisible"
				width="600px"
				:before-close="handleClose">

			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

				<el-form-item label="Parent menu" prop="parentId">
					<el-select v-model="editForm.parentId" placeholder="Please select the parent menu">
						<template v-for="item in tableData">
							<el-option :label="item.title" :value="item.menuId"></el-option>
							<template v-for="child in item.children">
								<el-option :label="child.title" :value="child.menuId">
									<span>{{ "- " + child.title }}</span>
								</el-option>
							</template>
						</template>
					</el-select>
				</el-form-item>

				<el-form-item label="Title" prop="title" label-width="100px">
					<el-input v-model="editForm.title" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="Icon" prop="icon" label-width="100px">
					<el-input v-model="editForm.icon" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Url" prop="url" label-width="100px">
					<el-input v-model="editForm.url" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="Component" prop="component" label-width="100px">
					<el-input v-model="editForm.component" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="Type" prop="type" label-width="100px">
					<el-radio-group v-model="editForm.type">
						<el-radio :label=0>Catalogue</el-radio>
						<el-radio :label=1>Menu</el-radio>
						<el-radio :label=2>Route</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="Status" prop="status" label-width="100px">
					<el-radio-group v-model="editForm.status">
						<el-radio :label=0>Normal</el-radio>
						<el-radio :label=1>Disable</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="Order Number" prop="orderNum" label-width="100px">
					<el-input-number v-model="editForm.orderNum" :min="1" label="Order Number">1</el-input-number>
				</el-form-item>


				<el-form-item>
					<el-button type="primary" @click="submitForm('editForm')">Submit</el-button>
					<el-button @click="resetForm('editForm')">Reset</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>

    <Footer></Footer>


	</div>

</template>

<script>
	import Footer from "@/components/Footer";
  export default {
		name: "SystemRoute",
    components: {Footer},
    data() {
			return {
        loading: false,
				dialogVisible: false,
				editForm: {

				},
				editFormRules: {
					parentId: [
						{required: true, message: 'Please select the parent menu', trigger: 'blur'}
					],
					name: [
						{required: true, message: 'Please enter name', trigger: 'blur'}
					],
					perms: [
						{required: true, message: 'Please enter perms', trigger: 'blur'}
					],
					type: [
						{required: true, message: 'Please select type', trigger: 'blur'}
					],
					orderNum: [
						{required: true, message: 'Please select order number', trigger: 'blur'}
					],
					status: [
						{required: true, message: 'Please select status', trigger: 'blur'}
					]
				},
				tableData: []
			}
		},
		created() {
			this.getMenuTree()
		},
		methods: {
			getMenuTree() {
        this.loading = true
				this.$axios.get("/sys/menu/list", {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {

					this.tableData = res.data.data
          this.loading = false

				})
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/menu/' + (this.editForm.menuId?'update' : 'save'), this.editForm, {
              headers: {
                "Authorization": localStorage.getItem("myToken")
              }
            })
							.then(res => {

								this.$message({
									showClose: true,
									message: 'Operation successful!',
									type: 'success',
									onClose:() => {
										this.getMenuTree()
									}
								});

								this.dialogVisible = false
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			editHandle(id) {
				this.$axios.get('/sys/menu/info/' + id, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
					this.editForm = res.data.data

					this.dialogVisible = true
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
				this.editForm = {}
			},
			handleClose() {
				this.resetForm('editForm')
			},
			delHandle(id) {
				this.$axios.post("/sys/menu/delete/" + id, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
					this.$message({
						showClose: true,
						message: 'Operation successful!',
						type: 'success',
						onClose:() => {
							this.getMenuTree()
						}
					});

				})
			}
		}
	}
</script>

<style scoped>

</style>
