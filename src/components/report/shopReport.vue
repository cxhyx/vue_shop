<template>
  <div>
    <!-- 🍞面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 💳卡片视图区域 -->
    <el-card>
      <!-- * *2为Echarts 准备一个具备大小 (宽高) 的DOM -->
      <div id="main" style="width: 1000px; height: 600px"></div>
    </el-card>
  </div>
</template>

<script>
// *1.导入echarts
import echarts from 'echarts'

import _ from 'lodash'

export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  //  只有执行到mounted 这个函数 此时页面上的元素 已经被渲染完成了！
  async mounted() {
    // *3.基于准备好的dom,初始化echarts
    const myChart = echarts.init(document.getElementById('main'))

    // 发起请求
    const { data: res } = await this.$http.get('reports/type/1')

    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }

    // *4.准备数据和 配置项
    // 指定图表的配置项和数据
    const result = _.merge(res.data, this.options)

    // *5.展示数据
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped></style>
