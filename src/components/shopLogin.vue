<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
      >
          <!-- 用户名 -->
          <el-form-item label="用户名" class="info" prop="username">
            <el-input
              v-model="loginForm.username"
              suffix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" class="info" prop="password">
            <el-input
              v-model="loginForm.password"
              suffix-icon="iconfont icon-3702mima"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shopLogin',
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // console.log(this) VC
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid)
        // 验证结果 true FALSE
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // *1、将登录成功之后的 token ，保存到客户端的sessionStorage 中
        // *   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // *   1.2 token 只应用在当前网站打开期间生效，所以将 token保存 在 sessionStorage 中

        window.sessionStorage.setItem('token', res.data.token)
        // *2、通过编程式导航跳转到后台主页，路由地址是 /home
        // this.$router.push('/users')
        this.$router.push('/welcome')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4a6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 90%;
  max-width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  position: relative;

  .avatar_box {
    position: absolute;
    top: -75px;
    box-sizing: border-box;
    background-color: transparent;
    height: 130px;
    padding-top: 20px;
    width: 130px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 1px 3px 6px #0000001a, -2px -3px 6px #0000001a;
    img {
      width: 80%;
      height: auto;
    }
  }
  .el-form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
}

.btns {
  float: right;
}
.info {
  color: #555;
  font-size: 18px;
}
</style>
