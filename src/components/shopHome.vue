<template>
  <el-container>
    <!-- 头部区 -->
    <el-header>
      <div>
        <div class="logo">
          <img src="@/assets/logo.png" alt="" />
        </div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" size="medium" @click="loginOut"
        >退出登录</el-button
      >
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--  -->
        <div class="toggle-button" id="collapseControl" @click="toggleCollapse">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              style="width: 2em; height: 2em; display: none"
              v-show="!isCollapse"
            >
              <path
                fill="currentColor"
                d="M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              style="width: 2em; height: 2em"
              v-show="isCollapse"
            >
              <path
                fill="currentColor"
                d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"
              ></path>
            </svg>
          </button>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          active-text-color="#2f95fb"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsOBj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      name: 'shopHome',
      // 左侧菜单数据
      menuList: [],
      iconsOBj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    // 创建前获取所有数据
    this.getMenuList()
    //
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮 ，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    // 点击 保存 url 的地址 在session中 再给默认的激活(default-active)动态切换
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #14213d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: transparent;
      box-shadow: 0 4px 5px #0000004d;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 60%;
        height: auto;
      }
    }
    > span {
      color: #fff;
      font-size: 1.2rem;
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #fff;
  > .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e5e5e5;
}
.iconfont {
  margin-right: 8px;
}
#collapseControl {
  display: flex;
  justify-content: flex-end;
  color: #e5e5e5;

  > button {
    cursor: pointer;
    border: none;
    background-color: transparent;
    border-radius: 4px;
    box-shadow: 0 2px 4px #0000001a;
    margin-right: 18px;
    z-index: 999;
  }
}
.el-row{
  padding: 10px 0;
}
</style>
