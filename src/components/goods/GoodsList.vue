<template>
  <div>
    <!-- ðé¢åå±å¯¼èªåº -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">é¦é¡µ</el-breadcrumb-item>
      <el-breadcrumb-item>ååç®¡ç</el-breadcrumb-item>
      <el-breadcrumb-item>åååè¡¨</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- ð³å¡çè§å¾åºå -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- è¾å¥ -->
          <el-input
            placeholder="è¯·è¾å¥åå®¹"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- æé® -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">æ·»å åå</el-button>
        </el-col>
      </el-row>

      <!-- ðtableè¡¨æ ¼åºå -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="åååç§°" prop="goods_name"></el-table-column>
        <el-table-column
          label="ååä»·æ ¼(å)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="ååéé"
          prop="goods_weight"
          width="80px"
        ></el-table-column>
        <el-table-column label="åååå»ºæ¶é´" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="æä½" width="130px">
          <template slot-scope="scope">
            <!-- ç¼è¾æé® -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
            <!-- å é¤æé® -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- ðåé¡µåºå -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // æ¥è¯¢åæ°å¯¹è±¡
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // åååè¡¨
      goodsList: [],
      // æ»æ°æ®æ¡æ°
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // æ ¹æ®åé¡µè·åå¯¹åºçåååè¡¨
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('è·ååååè¡¨å¤±è´¥ï¼')
      }

      this.$message.success('è·ååååè¡¨æåï¼')
      console.log(res.data)

      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // --é¡µé¢åå
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // é¡µç åå
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // æ ¹æ®id å é¤åå
    async removeById(id) {
      const confirmResult = await this.$confirm('æ­¤æä½å°æ°¸ä¹å é¤è¯¥åå, æ¯å¦ç»§ç»­?', 'æç¤º', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('å·²åæ¶å é¤ï¼')
      }
      // åèµ·è¯·æ±å é¤
      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('å é¤å¤±è´¥ï¼')
      }
      this.$message.success('æåå é¤ååï¼')
      this.getGoodsList()
    },
    // ç¹å»è·³è½¬
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  padding: 15px !important;
}
.el-pagination {
  padding: 10px;
}
</style>
