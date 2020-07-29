<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片式图 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleList" border style="width: 100%">
				<!-- 展开列 -->
				<el-table-column type="expend" >
					<template slot-scope="scope">
						<!-- {{scope.row}} -->
						<!-- 栅格系统 -->
						<el-row v-for="(item, index) in scope.row.children" :key="item.id" :class="['bdbottom', index === '0' ? 'bdtop' : 'bdbottom', 'wcenter']">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag @close="removeById(scope.row, item.id)" closable>>{{item.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二级权限 -->
							<el-col :span="19">
								<el-row v-for="(item1, index1) in item.children" :key="item1.id" :class="['bdbottom', index1 === '0' ? '' : 'bdtop', 'wcenter']">
									<el-col :span="6"><el-tag @close="removeById(scope.row, item1.id)" closable>>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i></el-col>
									<el-col :span="18"><el-tag v-for="item2 in item1.children" :key="item2.id" type="warning" @close="removeById(scope.row, item2.id)" closable>{{item2.authName}}</el-tag></el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<!-- //索引列 -->
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="roleName" label="角色名称"></el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
				<el-table-column label="操作">
				  <template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click="setRightDilong(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>				
			</el-table>
		</el-card>
		<!-- 分配权限对话框 -->
		<el-dialog title="分配权限" :visible.sync="setDalogVisible" width="50%" @close="setDialogClose">
			<!-- 内容主题区域 -->
			<el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-expanded-keys="checkedRole" ref="treeRef"></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setDalogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
			//所有角色列表数据
			roleList: [],
			setDalogVisible: false,
			// 所有权限列表数据
			rightList: [],
			treeProps: {
				label: 'authName',
				children: 'children'
			},
			//已经选中的三级权限的ID
			checkedRole: [],
			// 当前即将分配权限的ID
			roleId: ''
		}
	},
	created() {
    this.getRoleList()
	},
	methods: {
    async getRoleList() {
			const {data: res} = await this.$http.get('roles')
			if(res.meta.status !== 200) {
				return this.$message.error('获取角色列表失败')
			}
			this.roleList = res.data
		},
		//弹框是否确认删除标签
		async removeById(role, rigthId) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
				}).catch((err) => err)
				//返回值是一个promise，异步函数简化promise操作，点击确定，返回字符串confirm,点击取消返回错误消息，返回字符串cancel
				console.log(confirmResult);	
				if(confirmResult !== 'confirm') {
          return this.$message.info('取消了删除')
				}
				const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rigthId}`)
				if(res.meta.status !== 200) {
					return this.$$message.error('删除失败')
				}
				role.children = res.data
		},
    //获取权限
		async setRightDilong(role) {
			this.roleId = role.id
			const {data: res} = await this.$http.get('right/tree')
			if(res.meta.status !== 200) return this.$message.error('获取失败')
			//获取到的权限数组保存
			this.rightList = res.data
			this.treeRole(role, this.checkedRole)
      this.setRightDilong = true
		},
		// 通过递归的方式获取角色下所有三级权限的ID，node是判断的节点
		treeRole(node, arr) {
			if(!node.children) {
        return arr.push(node.id)
			}
			node.children.forEach(item => {
				this.treeRole(item, arr)
			});
		},
		// 监听分配权限对话框的关闭事件
		setDialogClose() {
			this.checkedRole = []
		},
		// 点击为角色分配权限
		async addRole() {
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
			]
			const isStr = keys.join(',')
			const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: isStr})
			if(res.meta.status !== 200) {
				return false
			}
			this.$message.success('ok')
			this.getRoleList()
			this.setRightDilong = false
		}
	}
}
</script>

<style lang="less" scoped>
  .el-tag {
		margin-top: 15px;
	}
	.bdtop {
    border-top: 1px solid #ccc;
	}
	.bdbottom {
		border-bottom: 1px solid #ccc;
	}
	.wcenter {
		display: flex;
		align-items: center;
	}
</style>
