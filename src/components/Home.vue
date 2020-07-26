<template>
	<div>
		<el-container class="home">
			<!-- //头部 -->
				<el-header>	
					<div>
						<img src="../assets/logo.png" alt="">
						<span>管理系统</span>
					</div>	
					<el-button type="info" @click="logout">退出</el-button>
				</el-header>
			<!-- 主体部分 -->
		  <el-container>
      <!-- 侧边栏 -->
			  <el-aside :width="isCollapse  ? '200px' : '64px'">
					<div class="toggle" @click="toggle">|||</div>
					<el-menu
						default-active="2"
						class="el-menu-vertical-demo"
						@open="handleOpen"
						@close="handleClose"
						background-color="#333744"
						text-color="#fff"
						active-text-color="#ffd04b"
						unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" ：default-active="/activePath">
						<!-- //一级菜单 -->
						<el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
							<!-- 一级菜单的模板 -->
							<template slot="title">
								<!-- 图标 -->
								<i :class="iconList[id]"></i>
								<!-- 文本 -->
								<span>{{item.authName}}</span>
							</template>
                  <!-- 二级菜单 -->
							<el-menu-item :index="'/' + itemList.path" v-for="itemList in item.children" :key="itemList.id" @click="saveActive('/' + itemList.path)">
								<template slot="title">
								<!-- 图标 -->
								<i class="el-icon-location"></i>
								<!-- 文本 -->
								<span>{{itemList.authName}}</span>
								</template>
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-aside>
			<!-- 右侧主体 -->
			  <el-main>
					<router-view></router-view>
				</el-main>
		  </el-container>
	  </el-container>
	</div>
</template>

<script>
export default {
	data() {
    return {
			menuList: [],
			iconList: {
				"125": 'iconfont icon-user',
				"102": 'iconfont icon-danju',
				"145": 'iconfont icon-user',
				"101": 'iconfont icon-shangpin',
				"103": 'iconfont icon-user'
			},
			isCollapse: false,
			activePath: ''
		}
	},
	created() {
		this.getList(),
		this.activePath = window.sessionStorage.getItem('active')
	},
	methods: {
		logout() {
			window.sessionStorage.clear()
			this.$router.push('/login')
		},
		async getList() {
			const {data: res} = await this.$http.get('menus')
			console.log(res);
			if(res.meta.status !== 200) {
				this.$message.error(re.meta.msg)
			}
			this.menuList = res.data
		},
		toggle() {
      this.isCollapse = !this.isCollapse
		},
		saveActive(activePath) {
			window.sessionStorage.setItem('active', activePath)
			//为activePath重新复制
			this.activePath = activePath
		}
	}
}
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #373737;
		display: flex;
		justify-content: space-between;
		color: #fff;
		margin-left: 0;
		align-items: center;
		font-size: 20px;
		> div {
			display: flex;
			align-items: center;
			span {
				margin-left: 15px;
			}
		}
	}
	.el-aside {
    background-color: #333744;
	}
	.el-main {
		background-color: rgb(156, 141, 141);
	}
	.home {
		width: 100%;
	}
	.ionfont {
		margin-right: 10px;
	}
  .el-aside {
		background-color: #333744;
		.el-menu {
			border-right: none;
		}
	}
	.toggle {
		background-color: #fff;
		font-size: 10px;
		color: aliceblue;
		letter-spacing: 0.2em;
		cursor: pointer;
	}

</style>