# 项目概述

项目来自于[黑马](https://www.bilibili.com/video/BV1x64y1S7S7?from=search&seid=7855167686868267267)的电商后台管理系统。

电商后台管理系统用于管理用户账号、商品分类、商品信息、订单、数据统计等业务功能。



![目录.png](https://s2.loli.net/2022/11/02/E5dSfn7XZuIoHJD.png)

电商后台管理系统整体采用前后端分离的开发模式，其中前端项目是基于 Vue 技术栈的 SPA 项目，项目使用vue2 + element-ui。基于vue ui 初始化。



当然这里只需要写前端即可，项目已经提供了后端接口。



# 1.login组件

![login.png](https://s2.loli.net/2022/10/25/jDgMtsHScOViR2a.png)

login组件中，最重要的就是表单域。



项目使用了element ui的表单，这里是按需导入element的组件。

## 1.1 按需导入element组件

首先，安装 [element-ui](https://github.com/anncwb/vite-plugin-style-import):

```bash
$ npm i element-ui
```

接着修改 `element.js`，具体配置见[官网文档](https://element.eleme.io/#/zh-CN)。

```js
import Vue from 'vue'
import { Button, Form, FormItem,} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
```



最后在 `main.js` 中全局注册组件：

```js
//main.js
// 引入element-ui.js
import './plugins/element.js'
```



## 1.2 使用element组件

```html
<!-- 登录表单区域 -->
<el-form ref='loginFormRef' label-width="80px" :model="loginForm" :rules="loginFormRules">
  <!-- 用户名 -->
  <el-form-item label="用户名" class="info" prop="username">
    <el-input
      suffix-icon="iconfont icon-user"
      v-model="loginForm.username"
    ></el-input>
  </el-form-item>
  <!-- 密码 -->
  <el-form-item label="密码" class="info" prop="password">
    <el-input
      suffix-icon="iconfont icon-3702mima"
      v-model="loginForm.password"
      type="password"
    ></el-input>
  </el-form-item>
  <!-- 按钮 -->
  <el-form-item class="btns">
    <el-button type="primary" @click="login">登录</el-button>
    <el-button type="info" @click="resetLoginForm">重置</el-button>
  </el-form-item>
</el-form>
```



`:model="loginForm" ` ：表单中双向绑定的数据。

```js
data(){
    return {
        loginForm: {
  			username: "",
  			password: "",
		}
    }
}
```

`:rules = "loginFormRules">` ：表单验证规则

` <el-form-item  prop="username">` ：prop为绑定的验证规则

```js
// 放在data中  表单的验证规则
loginFormRules: {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 1,
      max: 10,
      message: "长度在 1 到 10 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "长度在 6到 18 个字符", trigger: "blur" },
  ],
},
```

`<el-form ref='loginFormRef'>` ：给form绑定了ref，方便使用表单组件的方法。

```js
// 重置表单 点击重置按钮
resetLoginForm() {
  this.$refs.loginFormRef.resetFields();
},
```

```js
// 点击登录按钮
login() {
  //   拿到表单预验证的结果
  this.$refs.loginFormRef.validate((valid) => {
    if (!valid) return;
  });
},
```

` <el-form-item label="用户名" >` ：label为input输入框前的文本标签



## 1.3 发起ajax请求

当用户点击登录后，且通过element ui表单的预校验验证后，应该向服务器发送ajax请求。

```js
login() {
  //   拿到表单预验证的结果
  this.$refs.loginFormRef.validate(async (valid) => {
    if (!valid) return;
    // 预验证成功，发起ajax请求
    let { data } = await this.$http.post("/login", this.loginForm);
    // 如果status为200，则验证通过
    if (data.meta.status !== 200) {
      return  console.log('登录失败');
    }
    console.log('登录成功')
  });
},
```



当然，不能直接把结果打印到控制台，应该弹窗提示用户。这里，导入element ui的message方法。

```js
import { Message } from 'element-ui'
// 挂载在 $message 上 
Vue.prototype.$message = Message


将上面的console.log('登录成功')和console.log('登录失败') 改为
  if (res.meta.status !== 200) return this.$message.error('登录失败！')
       
  this.$message.success('登录成功')

```



## 1.4 存储token

1. 将登录成功之后的`token`，保存到客户端的 `sessionStorag`中

- 项目中除了登录之外的其他API接口，必须在登录之后才能访问
- `token`只应在当前网站打开期间生效，将`token`保存在 `sessionStorage`中

2. 通过编程式导航跳转到后台主页，路由地址是`/home`。

```js
window.sessionStorage.setItem("token", data.data.token);
this.$router.push('/home');
```

# 2. 主页布局

## 2.1 新建主页组件

新建components/Home.vue 组件，并在router中导入它，并完成路径配置。

```js
//router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/shopLogin.vue'
import Home from '@/components/shopHome.vue'

const routes = [
  // 重定向路由规则
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',  component: Home }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
```

## 2.2 路由导航守卫控制页面访问权限

如果还没有登录，是不能直接进入到 `/home` 界面的，则需要重新导航登录页面，因此需要配置路由导航守卫。

```js
//router/index.js
// 路由导航
router.beforeEach((to, from, next) => {
  // * to 将要访问的路径
  // * from 代表从那个路径跳转而来
  // * 是一个函数，表示放行
  // *  next() 放行   next('/login') 强制跳转
  // 如果用户去登录页面，直接放行
  if (to.path === '/login') {
    next();
  }
  // 如果用户去其他页面，则判断他是否登录 (是否存在token)
  else {
    const tokenStr = window.sessionStorage.getItem('token');
    if (tokenStr) next(); //存在token  则放行
    else {
      // 否则跳转到登录页面
      next('/login');
    }
  }
});
```



## 2.3 实现退出功能

基于 token 的方式实现退出比较简单，只需要销毁本地的 token 即可。这样，后续的请求就不会携带 token，必须重新登录生成一个新的 token 之后才可以访问页面。

> 注意这里使用router的方式，先导入 `useRouter`，再使用。

```vue
//components/home.vue
<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
    
export default {
   methods: {
        loginOut() {
           // 清空token
          window.sessionStorage.removeItem("token");
          // 重新导航到登录页
          router.push('/login');
        },
  },
};
</script>
```




## 2.4 实现主页整体布局

![home.png](https://s2.loli.net/2022/10/25/Ai5aPegHlMJoCLf.png)

直接复制粘贴element ui的布局，最后记得要注册这些引入的组件。

```vue
<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
```

接着需要实现头部的布局，瞎写就行。





## 2.5 左侧菜单

### 2.5.1 左侧菜单布局



使用[Element UI](https://element.eleme.io/#/zh-CN/component/menu)进行布局，抄就完了。

### 2.5.2 通过axios拦截器添加token验证

需要授权的API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌。

```js
// main.js
// axios 请求拦截
axios.interceptors.request.use(config =>{
    // 为请求头对象，添加Token 验证的 Authorization
    config.headers.Authoriztion = window.sessionStorage.getItem('token');
    return config;
})
```



### 2.5.3 获取左侧菜单数据

```js
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
        // this.$http 是 在main.js 进行了 全局挂载
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
```

值得注意的是，获取全局定义`axios`函数，在main.js这样写：

```js
// main.js
import axios from 'axios'

Vue.prototype.$http = axios

//axios是异步的
// 使用 async await 简化 

```





### 2.5.4 通过双层for循环渲染左侧菜单数据

```vue
<el-aside width="200px">
  <el-menu
    background-color="#333"
    text-color="#fff"
    active-text-color="#ffd04b"
   unique-opened
  >
    <!-- 一级菜单 -->
    <el-submenu :index="'index'"  v-for="(menu,index) in menuList" :key="menu.id" >
      <!-- 一级菜单的模板区域 -->
      <template #title>
        <!-- 图标 -->
        <i class="el-icon-location"></i>
        <!-- 文本 -->
        <span>{{menu.authName}}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item :index="index+'-'+subIndex" v-for='(submenu,subIndex) in menu.children' :key= 'submenu.id'>
        <template #title>
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>{{submenu.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</el-aside>
```

接着进行自定义图标，老师定义了一个图标对象，我不知道这样的意义是什么，发送请求获取菜单内容，结果图标却是写死的。

```js
const iconsObj = {125:'iconfont icon-user',103:'iconfont icon-tijikongjian',101:'iconfont icon-shangpin',102:'iconfont icon-danju',145:'iconfont icon-baobiao'};
```

```vue
<!-- 一级菜单的模板区域 -->
<template #title>
  <!-- 图标 -->
  <i :class="iconsObj[menu.id]"></i>
  <!-- 文本 -->
  <span>{{ menu.authName }}</span>
</template>
```

最后，记得为菜单添加`unique-opened`属性，每次只能打开一个菜单。



### 2.5.5 侧边栏折叠效果的实现

具体来说，就是给菜单加上一个`collapse`属性，当它的值为`true`时则折叠，反之亦然。另外，element-ui的折叠动画丑到爆，因此索性直接`:collapse-transition= 'false'`关闭折叠动画。

```vue
<el-menu  :collapse="isCollapse"  unique-opened :collapse-transition= 'false' >
  <!-- 一级菜单 -->
  <el-submenu
    :index="index + ''"
    v-for="(menu, index) in menuList"
    :key="menu.id"
  >
    <template #title>
      <i :class="iconsObj[menu.id]"></i>
      <span>{{ menu.authName }}</span>
    </template>
    <!-- 二级菜单 -->
    <el-menu-item
      :index="'/'+submenu.path"
      v-for="(submenu) in menu.children"
      :key="submenu.id"
    >
      <template #title>
        <i class="el-icon-menu"></i>
        <span>{{ submenu.authName }}</span>
      </template>
    </el-menu-item>
  </el-submenu>
</el-menu>
```



最后，再加上一个按钮控制`collapse`的属性值即可。另外给侧边栏加一个判断，`collapse`为值时，缩小宽度。

<img src="https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108201843382.png" alt="image-20210820184310267" style="zoom:50%;" />

<img src="https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108201843681.png" alt="image-20210820184334624" style="zoom:50%;" />

### 2.5.6  侧边栏路由链接

### Menu Attribute

| 参数                | 说明                                                         | 类型    | 可选值                | 默认值   |
| :------------------ | :----------------------------------------------------------- | :------ | :-------------------- | :------- |
| mode                | 模式                                                         | string  | horizontal / vertical | vertical |
| collapse            | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）         | boolean | —                     | false    |
| background-color    | 菜单的背景色（仅支持 hex 格式）                              | string  | —                     | #ffffff  |
| text-color          | 菜单的文字颜色（仅支持 hex 格式）                            | string  | —                     | #303133  |
| active-text-color   | 当前激活菜单的文字颜色（仅支持 hex 格式）                    | string  | —                     | #409EFF  |
| default-active      | 当前激活菜单的 index                                         | string  | —                     | —        |
| default-openeds     | 当前打开的 sub-menu 的 index 的数组                          | Array   | —                     | —        |
| unique-opened       | 是否只保持一个子菜单的展开                                   | boolean | —                     | false    |
| menu-trigger        | 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)         | string  | hover / click         | hover    |
| router              | 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 | boolean | —                     | false    |
| collapse-transition | 是否开启折叠动画                                             | boolean | —                     | true     |

可以看到菜单有一个属性叫`router`，开启它后便会给子菜单加上路由链接，并且以index的值作为导航的path。

```vue
<el-menu-item
  :index="'/home/' + submenu.path"
  v-for="submenu in menu.children"
  :key="submenu.id"
>
  <template #title>
    <i class="el-icon-menu"></i>
    <span>{{ submenu.authName }}</span>
  </template>
</el-menu-item>
```

## 2.6 首页重定向

当用户进入到首页（`/home`）后，应该重定向到欢迎界面，在home组件添加路由占位符。当然，还得创建一个欢迎界面的组件。

```vue
//home.vue
<!-- 右侧内容主体 -->
<el-main>
  <router-view></router-view>
</el-main>
```



然后再配置路由：



```js
//router/index.js

//导入欢迎界面的组件
import Welcome from '../components/Welcome.vue';

const routes = [
  // 重定向路由规则
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // 路由重定向
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
]

const router = new VueRouter({
  routes
})
```



# 3 实现用户管理/用户列表的功能

## 3.1 创建用户列表的路由

这个就不用废话了。

## 3.2 左侧菜单的激活状态

menu的属性见上面的表格，其中有个属性是`default-active`，其值是某个菜单的index。老师说通过sessionStorage来存储某个被激活的菜单的index.

```vue
     <!-- 侧边栏菜单区域 -->
        <el-menu
          active-text-color="#2f95fb"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
```

PS：想要在 created() 中访问到，需要这样写：

```js

export default {

   created() {
        // 创建前获取所有数据
        this.getMenuList()
        //
        this.activePath = window.sessionStorage.getItem('activePath')
  },

}
```



## 3.3 完成用户列表组件的基本布局

```vue
<template>
  <div>
    <!-- 🍞面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 🪧卡片视图区域 -->
    <el-card>
      <div>
        <el-row :gutter="20">
          <!-- span总数为24 -->
          <el-col :xs="{ span: 24 }" :sm="{ span: 12 }">
            <el-input placeholder="请输入内容" class="input">
              <template #append>
                <el-button icon="el-icon-search"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="{ span: 24 }" :sm="{ span: 4 }">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
```





## 3.4 获取用户列表数据

```vue
//components/user.vue
<script>
    export default {
        data(){
            return {
                 // 获取用户列表的参数对象
                  queryInfo: {
                    // 搜索
                   query: '',
                    // 当前的页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 2
                  },
                  // 用户列表
                  userList: [],
                  // 总共的数据
                  total: 0,
            }
        }
         methods: {
            // 获取数据
            async getUserList() {
              const { data: res } = await this.$http.get('users', {
                params: this.queryInfo
              })
              if (res.meta.status !== 200) {
                return this.$$message.error('获取用户失败！')
              }
              // 渲染到页面
              this.userList = res.data.users
              this.total = res.data.total
              console.log(res)
        },
    }
</script>
```



## 3.5 渲染数据

使用element-ui 的表格，渲染数据。

```vue
<el-table :data="userList" stripe style="width: 100%" border>
  <el-table-column prop="username" label="姓名😎"> </el-table-column>
  <el-table-column prop="email" label="邮箱📭"> </el-table-column>
  <el-table-column prop="mobile" label="电话📱"> </el-table-column>
  <el-table-column prop="role_name" label="角色🧐"> </el-table-column>
  <el-table-column prop="mg_state" label="状态👌"> </el-table-column>
  <el-table-column  label="操作🤷‍♀️"> </el-table-column>
</el-table>
```

最后，在最前面加上索引列。

```vue
 <el-table-column type='index' label='#'> </el-table-column>
```

最终效果：

![home.png](https://s2.loli.net/2022/10/25/Ai5aPegHlMJoCLf.png)

### 3.5.1 将状态栏改造为开关

将状态栏改造为开关，因此用到了作用域插槽，获取到表格的数据，绑定到开关上。注意是`scope.row`，不要忘记了row，通过scope.row获取到当前行的数据。

```vue
<el-table-column label="状态👌">
  <template #default="scope">
    <el-switch
      v-model="scope.row.mg_state"
      active-color="#13ce66"
      inactive-color="#ff4949"
    >
    </el-switch>
  </template>
</el-table-column>
```

![image-20210822120126247](https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108221201282.png)

### 3.5.2 改造操作列

有个很有趣的组件叫`tooltip`，当鼠标hover在按钮上会显示提示。

![image-20210822122450648](https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108221224684.png)

它有一个属性叫`enterable`，默认是开启的；关闭后，可以实现自动隐藏的效果。

```vue
<el-table-column label="操作🤷‍♀️" width="180px">
          <template #default>
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
```

![image-20210822125154229](https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108221251268.png)

## 3.6 实现分页效果

```vue
<el-pagination
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  :current-page="queryInfo.pagenum"
  :page-sizes="[1, 2, 5, 10]"
  :page-size="queryInfo.pagesize"
  layout="total, sizes, prev, pager, next, jumper"
  :total="total"
>
</el-pagination>
```

| 事件名称       | 说明                     | 回调参数 |
| :------------- | :----------------------- | :------- |
| size-change    | pageSize 改变时会触发    | 每页条数 |
| current-change | currentPage 改变时会触发 | 当前页   |

- page-sizes： 控制每页显示的条数
- page-size： 当前每页显示的条数
- layout： 要被显示的部件
- total：总条数

```js
// 实现分页效果

//监听pagesize改变的事件 处理每页显示的条数变化
function handleSizeChange(newSize) {
  console.log(newSize);
  queryInfo.pagesize = newSize;
  // 重新发起请求
  getUserList();
}
// 监听页码的变化
function handleCurrentChange(newPage) {
  queryInfo.pagenum = newPage;
  getUserList();
}
```

## 3.7 保存用户状态的修改

开关的变化会触发change事件，当发生变化时，重新发送ajax请求。

| 事件名称 | 说明                            | 回调参数   |
| :------- | :------------------------------ | :--------- |
| change   | switch 状态发生变化时的回调函数 | 新状态的值 |

```vue
<el-table-column label="状态👌">
  <template #default="scope">
    <el-switch
      v-model="scope.row.mg_state"
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="userStateChanged(scope.row)"
    >
    </el-switch>
  </template>
</el-table-column>
```

```js
// 监听Switch开关状态的变化 保存用户状态的变化
// 发送put请求 请求路径：users/:uId/state/:type
async function userStateChanged(userInfo) {
  const {data} = await axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
  // 如果登录状态修改成功
  if(data.meta.status !== 200) {
    // 因为没有修改成功，所以立刻将状态改回去
    userInfo.mg_state=!userInfo.mg_state
   if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$.error('更新用户状态失败！')
   	}
      this.$message.success('更新用户状态成功！')
  }
      
}
```

## 3.8 实现搜索功能

```vue
<el-input placeholder="请输入内容" class="input" v-model="queryInfo.query" clearable @clear='getUserList' @keyup.enter='getUserList'>
  <template #append>
    <el-button icon="el-icon-search" @click="getUserList"></el-button>
  </template>
</el-input>
```

首先双向绑定输入的数据`v-model="queryInfo.query"`，接着当用户点击按钮时发送请求`@click="getUserList"`。

为了让功能更完善，给输入框增加清除属性`clearable`，当点击小叉叉时，触发清除事件然后再次发送请求（此时的query是空的，因此可以获取到所有数据）。

另外当回车后，也应该触发请求`@keyup.enter='getUserList'`。

![image-20210822143545815](https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108221435857.png)

## 3.9 添加用户功能

### 3.9.1 添加用户的对话框

使用Element-ui[对话框组件](https://element-plus.org/#/zh-CN/component/dialog#dialog-dui-hua-kuang)：

```vue
<!-- 添加用户的对话框组件 -->
<el-dialog title="提示" v-model="dialogVisible" width="50%">
  <!-- 对话框内容主体区域 -->
  <span>这是一段信息</span>
  <!-- 底部区域 -->
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false"
        >确 定</el-button
      >
    </span>
  </template>
</el-dialog>
```

给添加用户的按钮绑定点击事件

```vue
<el-col :xs="{ span: 24 }" :sm="{ span: 4 }">
  <el-button type="primary" @click="dialogVisible = true"
    >添加用户</el-button
  >
</el-col>
```

最后在data中添加：

```js
  dialogVisible = false;
```



### 3.9.2 渲染添加用户的表单

[Element-ui 表单组件](https://element-plus.org/#/zh-CN/component/form#biao-dan-yan-zheng)

```vue
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
</el-form>
```

```js
export default {
    data(){
        return{
            addForm :{
               username: "",
               password: "",
               email: "",
               mobile: "",
            }); // 表单数据
           addFormRules :{
            username: [
              { required: true, message: "请输入用户名称", trigger: "blur" },
              { min: 3, max: 10, message: "用户名长度在 3~10 个字符", trigger: "blur"},
            ],
            password: [
              { required: true, message: "请输入密码", trigger: "blur" },
              { min: 6, max: 16, message: "用户名长度在 6~16 个字符", trigger: "blur" },
            ],
            email: [{ required: true, message: "请输入密码", trigger: "blur" }],
            mobile: [{ required: true, message: "请输入密码", trigger: "blur" }],
		}; //表单验证规则
       }
    }
}

```

### 3.9.3 自定义邮箱和手机号验证规则

```js
// 邮箱验证规则
const checkEmail = (rules, value, callback) => {
  const refEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  // 校验成功
  if(refEmail.test(value))  return callback();
  callback(new Error('请输入合法的邮箱'));
};
// 手机号验证规则
const checkMobile = (rules, value, callback) => {
const refMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
  // 校验成功
  if(refMobile.test(value))  return callback();
  console.log(refMobile.test(value));
  callback(new Error('请输入合法的手机号码'));
};
//表单验证规则

 addFormRules :{
  username: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    { min: 3, max: 10, message: "用户名长度在 3~10 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "用户名长度在 6~16 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: checkEmail, trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: checkMobile, trigger: "blur" },
  ],
}); 
```

### 3.9.4 关闭对话框后表单重置

给对话框绑定关闭事件，给表单绑定引用。

```vue
<el-dialog
  title="添加用户"
  v-model="dialogVisible"
  width="50%"
  @close="diaglogClose"
>
  <!-- 对话框内容主体区域 -->
  <el-form :model="addForm" :rules="addFormRules" ref="myForm">
  </el-form>
</el-dialog>
```





### 3.9.5 表单预校验

当用户点击确认时，需要检查当前表单的预校验是否通过，如果没有通过则直接返回，通过预校验后，才能发起请求。

```js
  // 点击按钮添加新用户(修改)
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
}
```

### 3.9.6 实现用户的添加

```js
 // 点击按钮添加新用户(修改)
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 添加成功之后隐藏对话框
        this.addDialogVisible = false
        // 刷新用户列表 重新获取用户列表数据
        this.getUserList()
      })
    },
}
```

## 3.10 实现用户修改功能

我不想写了，和前面一模一样，只是提交请求的地址不一样。



## 3.11 实现用户删除功能

在删除前，[弹框提示](https://element-plus.org/#/zh-CN/component/message-box)用户是否删除。

```vue
<el-button
  type="danger"
  icon="el-icon-delete"
  circle
  size="mini"
  @click="removeUserById(scope.row.id)"
></el-button>
```

```js
// 根据id删除对应的用户数据
    async removeUserById(id) {
      // console.log(id)
      // 先弹框询问用户是否删除数据 确认后再删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // err => cancel
      // *如果用户确认删除，则放回值为字符串 confirm
      // *如果用户取消删除，则放回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认了删除')
      //  发起请求删除用户
      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败!')
      }
      this.$message.success('删除用户成功!')
      // 删除成功后 刷新用户列表
      this.getUserList()
    },
```

## 3.12 实现用户分配角色

### 3.12.1 添加分配角色的对话框

### 3.12.2 渲染分配角色的表单

### 3.12.3 ...自定义规则，关闭对话框重置 、表单预验证、

### 3.12.4 添加角色

```js
   <!-- 分配角色按钮 -->
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                id="cxh"
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>


 // 点击按钮添加新用户(修改)
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 添加成功之后隐藏对话框
        this.addDialogVisible = false
        // 刷新用户列表 重新获取用户列表数据
        this.getUserList()
      })
    },
```






# 4.权限管理

## 4.1 权限列表



### 4.1.1 添加用户权限的路由

```js
import Rights from '../components/power/Rights.vue'


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/home/welcome', children: [
      { path: 'welcome', component: Welcome },
      { path: 'users', component: Users },
      {path:'rights',component:Rights},
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
```

### 4.1.2 绘制面包屑和卡片视图

```vue
//components/power/rights
<template>
  <div>
    <!-- 🍞面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 🪧卡片视图区域 -->
    <el-card> </el-card>
  </div>
</template>
```

### 4.1.3 获取权限列表的数据

```js
export default {
  data() {
    return {
      // 权限
      rightList: []
    }
  },

  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

      // 获取成功后保存在data 供模板使用
      this.rightList = res.data
      console.log(this.rightList)
    
 	 }
}
```

### 4.1.4 渲染列表中的数据

```vue
<el-card>
    <el-table :data="rightsList" border stripe>
    <el-table-column type="index" label="#"> </el-table-column>
    <el-table-column prop="authName" label="权限名称"> </el-table-column>
    <el-table-column prop="path" label="路径"> </el-table-column>
    <el-table-column prop="level" label="权限等级"> </el-table-column>
    </el-table>
</el-card>
```

![image-20210823142739998](https://gitee.com/zyxbj/image-warehouse/raw/master/pics/202108231427115.png)

接着美化一下最后一列，[使用element-ui的tag组件](https://element-plus.org/#/zh-CN/component/tag#tag-biao-qian)。

```vue
<el-table-column  label="权限等级">
    <template #default = 'scope'>
    <el-tag v-if="scope.row.level==='0'">一级</el-tag>
    <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
    <el-tag type="warning" v-else>三级</el-tag>
    </template>
</el-table-column>
```



## 4.2 角色列表



### 4.2.1 新建角色列表的路由

```js
import Roles from '../components/power/Roles.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/home/welcome', children: [
      { path: 'welcome', component: Welcome },
      { path: 'users', component: Users },
      {path:'rights',component:Rights},
      {path:'roles',component:Roles},
    ]
  }
];
```

### 4.1.2 绘制面包屑和卡片视图

```vue
<!-- 🍞面板屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 🪧卡片视图区域 -->
<el-card>
    <!-- 添加角色按钮 -->
    <el-row>
    <el-col><el-button type="primary">添加角色</el-button></el-col>
    </el-row>
    <!-- 角色列表区域 -->
</el-card>
```



### 4.2.3 获取权限列表的数据

```js
     // 所有角色列表数据
      roleList: [],

// 所有角色列表数据
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }

      this.roleList = res.data
      console.log(this.roleList)
    },
  }
```



### 4.2.4 添加 编辑 删除功能 

和前面用户管理完全相同，所以就不写笔记了。
