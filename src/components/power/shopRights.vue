<template>
  <div>
    <!-- ðé¢åå±å¯¼èªåº -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">é¦é¡µ</el-breadcrumb-item>
      <el-breadcrumb-item>æéç®¡ç</el-breadcrumb-item>
      <el-breadcrumb-item>æéåè¡¨</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- ð³å¡çè§å¾åºå -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="æéåç§°" prop="authName"></el-table-column>
        <el-table-column label="è·¯å¾" prop="path"></el-table-column>
        <el-table-column label="æéç­çº§" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">ä¸çº§</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">äºçº§</el-tag>
            <el-tag v-else type="warning">ä¸çº§</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'shopRights',
  data() {
    return {
      // æé
      rightList: []
    }
  },
  // è·åæç¨çæé
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('è·åæéåè¡¨å¤±è´¥ï¼')
      }

      // è·åæååä¿å­å¨data ä¾æ¨¡æ¿ä½¿ç¨
      this.rightList = res.data
      console.log(this.rightList)
    }
  }
}
</script>

<style lang="less" scoped>
// .el-card{
//   padding: 20px 0;
// }
</style>
