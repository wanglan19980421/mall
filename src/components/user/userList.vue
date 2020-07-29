<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片式图 -->
		<el-card class="box-card">
      <el-row :gutter="20">
				<el-col :span="9">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList"></el-input>
					<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
				</el-col>
				<el-col :span="4">
				  <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<el-table :data="userList" border style="width: 100%">
				<el-table-column type="index">
				</el-table-column>
				<el-table-column prop="username" label="姓名">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column prop="mubile" label="电话">
				</el-table-column>
				<el-table-column prop="role_name" label="角色">
				</el-table-column>
				<el-table-column prop="mg_state" label="状态">
					<template slot-scope="scope">
						<!-- {{scope.row}} -->
						<el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template>
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.roe.id)"></el-button>
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="roleList"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
				:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加用户的弹框 -->
		<el-dialog title="添加用户" :visible.sync="addDalogVisible" width="50%" @close="addDialogClose">
			<!-- 内容主题区域 -->
			<el-form :model="addForm" :rules="addRules" ref="addRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改用户对话框-->
		<el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editDialogClose">
			<!-- 内容主题区域 -->
			<el-form :model="editForm" :rules="editRules" ref="editRef" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialog = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 分配角色对话框 -->
		<el-dialog title="分配角色" :visible.sync="roleDialog" width="50%" @close="roleDialogClose">
			<!-- 内容主题区域 -->
			<div>
				<p>当前用户: {{userInfo.username}}</p>
				<p>当前的角色： {{userInfo.role_name}}</p>
				<p>分配的角色：
					<el-select v-model="selectRoleList" placeholder="请选择">
						<el-option
							v-for="item in rolesList"
							:key="item.id"
							:label="item.roleName"
							:value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="roleDialog = false">取 消</el-button>
				<el-button type="primary" @click="saveUserInfo(scope.row)">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
  data() {
		//验证邮箱,验证value，value是用户输入的值,合法就callback
		let checkEmail = (rule, value, callback) => {
			const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
			if(regEmail.test(value)) {
				return callback()
			}
			callback(new Error('请输入正确的邮箱'))
		}
		// //验证手机号
		let checkMobile = (rule, value, callback) => {
			const regMobile =  /^1[3456789]\d{9}$/
			if(regMobile.test(value)) {
				return callback()
			}
			callback(new Error('请输入正确的手机号'))
		}
		return {
      queryInfo: {
				query: '', 
				pagenum: 1,
				pagesize: 2
			},
			userList: [],
			total: 0,
			// 添加用户对话框关闭打开状态
			addDialogVisible: false, 
			// 修改用户对话框关闭打开状态
			editDialog: false,
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			addRules: {
        username: [
					{required: true, message: '请输入用户名', trigger: 'blur'},
					{min: 3, max: 6, message:'用户名长度在3-5位', trigger: 'blur'}
				],
				password: [
					{required: true, message: '请输入密码', trigger: 'blur'},
					{min: 3, max: 6, message:'密码长度在3-5位', trigger: 'blur'}
				],
				email: [
					{required: true, message: '请输入邮箱', trigger: 'blur'},
					{validator: checkEmail, trigger: 'blur'}
				],
				mobile: [
					{required: true, message: '请输入手机号', trigger: 'blur'},
					{validator: checkMobile, trigger: 'blur'}
				],
			},
			//查询到的用户信息
			editForm: {},
			editRules: {
				email: [
					{required: true, message: '请输入邮箱', trigger: 'blur'},
					{validator: checkEmail, trigger: 'blur'}
				],
				mobile: [
					{required: true, message: '请输入手机号', trigger: 'blur'},
					{validator: checkMobile, trigger: 'blur'}
				]
			},
			//控制分配角色对话框
			roleDialog: false,
			// 需要被分配角色的用户
			userInfo: {},
			//所有角色的数据列表
			rolesList: [],
			// 已选中的角色
			selectRoleList: ''
		}
	},
	created() {
    this.getUserList()
	},
	methods: {
    async getUserList() {
			const {data: res} = await this.$http.get('users', {params: this.queryInfo})
			console.log(res);
			if(res.meta.status !== 200) {
				return this.$message.error('数据获取失败')
			}
			this.userList = res.data
			this.total = res.total
		},
		// 监听pagesize改变的事件
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize
			this.getUserList()
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},
		async changeState(userInfo) {
      console.log(userInfo);
			const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
			if(res.meta.status !== 200) {
				userInfo.mg_state = !userInfo.mg_state
				return this.$message.error('更新用户状态失败')
			}
			return this.$message.success('更新用户状态成功')
		},
		// 关闭对话框并且重置
		addDialogClose() {
      this.$refs.addRef.resetFields()
		},
		// 添加用户
		addUser() {
			this.$refs.addRef.validate((valid) => {
				if(!valid) return
				const {data: res} = await this.$http.post('users', this.addForm)
				if(res.meta.status !== 201) return this.$message.error('添加用户失败')
				this.$message.success('添加用户成功')
				// 关闭对话框
				this.addDialogClose = false
				//重新获取用户列表
				this.getUserList()
			})
		},
    async showEditDialog(id) {
			console.log(id);
			const {data: res} = await this.$http.get('users/' + id)
			if(res.mets.status !== 200) return this.$message.error('查询用户信息失败')
			thid.editForm = res.data
			this.editDialog = true
		},
    editDialogClose() {
			this.$refs.editRef.resetFields()
		},
		// 预验证
    editUserInfo() {
			this.$refs.editRef.validate( async valid => {
				if(!valid) return
				const {data: res} = await this.$http.put('users/' + this.editForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
				if(res.meta.status !== 200) return this.$message.error('更新用户信息失败')
				//关闭弹框
				this.editDialog = false
				// 、、刷新列表
				this.getUserList()
				// 提示修改成功
				return this.$message.success('修改用户信息成功')
			})
		},
		//删除用户信息
		async deleteUser(id) {
			const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
				}).catch((err) => err)
				//返回值是一个promise，异步函数简化promise操作，点击确定，返回字符串confirm,点击取消返回错误消息，返回字符串cancel
				console.log(confirmResult);	
				// 取消删除
				if(confirmResult !== 'confirm')	{
					return this.$message.info('用户取消了删除')
				}	
				const {data: res} = await this.$$http.delete('users/' + id) 
				if(res.meta.status !== 200) {
					return this.$message.error('删除用户失败')
				}
				this.$message.success('删除用户成功')
				this.getUserList()
		},
		async roleList(userInfo) {
			this.userInfo = userInfo
			//在展示对话框前展示所有角色
			const {data: res} = await this.$http.get('roles')
			if(res.meta.status !== 200) {
				return this.$message.error('error')
			}
			this.rolesList = res.data
			this.roleDialog = false
		},
		// 点击按钮分配角色
		async saveUserInfo() {
      if(!this.selectRoleList) {
				return this.$message.info('error')
			}
			const {data: res} = await this.$http.get(`users/${this.userInfo}/role`, {rid: this.selectRoleList.id})
			if(res.meta.status !== 200) {
				return this.$message.error('error')
			}
			return this.$message.success('ok')
			this.getUserList()
			this.showEditDialog = false
		},
		roleDialogClose() {
			this.userInfo = {}
			this.selectRoleList = ''
		}
	}

}
</script>

<style>

</style>