<template>
	<div class="login-container">
    <div class="login-box">
			<!-- 头像区 -->
			<div class="active-box">
				<img src="../assets/logo.png" alt="">
			</div>
      <!-- 表单区域 -->
			<!-- :model是数据绑定 -->
			<el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginRule" ref="loginRef">
				<!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-showpassword" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click='reset'>重置</el-button>
        </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
  data() {
		return {
			// 登录表单的数据绑定对象
      loginForm: {
				username: '',
				password: ''
			},
			loginRule: {
				username: [
					{required: true, message: '请输入用户名', trigger: 'blur'},
					{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
				password: [
					{required: true, message: '请输入密码', trigger: 'blur'},
					{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
    reset() {
			// this是实例对象，里面包含$refs
			this.$refs.loginRef.resetFields()
		},
		login() {
			//表单登录之前的预验证
			this.$refs.loginRef.validate( async valid => {
				console.log(valid);
				if(!valid) return;
				const {data: res} = await this.$http.post('login', this.loginForm)
				console.log(res);
				if(res.status !== 200) {
					return this.$message.error('登陆失败')
				}
				this.$message.success('登陆成功')
				//将token保存到sessionStorage中
				window.sessionStorage.setItem('token', res.data.token)
				this.$router.push('/home')
			})
		}
	}
}
</script>

<style lang="less" scoped>
.login-container {
	background-color: rgb(33, 28, 104);
	height: 100%;
}
.login-box {
	width: 450px;
	height: 300px;
	background-color: #fff;
	border-radius: 3px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

  .active-box {
	width: 130px;
	height: 130px;
	border-radius: 50%;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 10px;
	background-color: #fff;
	box-shadow: 0 0 5px #ddd;
	  img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #fff;
	}
}
}
.btn {
	display: flex;
	justify-content: flex-end;
}
.login-form {
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
}
</style>