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
      <el-table :data="rightList" border style="width: 100%">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
				<el-table-column prop="path" label="路径" width="180"></el-table-column>
				<el-table-column prop="level" label="权限等级">
					<template slot-scope="scoped">
						<el-tag v-if="scoped.row.level === '0'">一级权限</el-tag>
						<el-tag v-else-if="scoped.row.level === '1'" type="success">二级权限</el-tag>
						<el-tag v-else type="warning">三级权限</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
export default {
  data() {
		return {
      rightList: []
		}
	},
	created() {
    this.getRightList()
	},
	methods: {
    async getRightList() {
			const {data: res} = await this.$http.get('rights/list')
			if(res.meta.status !== 200) {
				return this.$message.error('获取权限列表失败')
			}
			this.rightList = res.data
		}
	}
}
</script>

<style lang="less" scoped>

</style>