axios配置,在main中
>>import axios from 'axios'
>>Vue.prototype.$http = axios
>>axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
## 登录
>重置： refs="login", 在方法中存在this指向Vue实例化对象。里面包含$refs，且值和定义的值一致， 调用resetFields
>登录： 预验证this.$refs.loginRef.validate( async valid => {} 接口数据解构出data数据，判断vaild是否为true，不是，返回提示，是将用户信息发送后台。//将登陆成功之后的token保存到客户端的sessionStorage中，window.sessionStorage.setItem('token', res.data.token)//项目中除了登陆之外其它API都要的登录之后才能访问，token只能在当前网站打开期间生效，所以将token保存在session Storage中//通过编程式导航跳转到后台主页
## 路由导航守卫
beforeeach(to, from, next)如果to.path==='/login return next(), 获取token，如果token不存在，则强制跳转到next（'/login'）
## git
1.git checkout -b user 创建本地分支user
2.git status 查看状态
3.git add .放入暂存区
4.git commit -m '' 提交
git push -u origin user远程上创建user分支
git checkout master 切换到mester分支
git merge user 合并分支
git push push到远程仓库

