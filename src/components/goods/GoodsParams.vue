<template>
  <div>
    <!-- ðé¢åå±å¯¼èªåº -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">é¦é¡µ</el-breadcrumb-item>
      <el-breadcrumb-item>ååç®¡ç</el-breadcrumb-item>
      <el-breadcrumb-item>åæ°åè¡¨</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- ð³å¡çè§å¾åºå -->
    <el-card>
      <!-- å¤´é¨è­¦ååºå -->
      <el-alert
        type="warning"
        title="æ³¨æï¼åªåè®¸ä¸ºç¬¬ä¸çº§åç±»è®¾ç½®ç¸å³åæ°ï¼"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- éæ©åååç±»åºå -->
      <el-row class="cat_opt">
        <el-col>
          <span>éæ©åååç±»:</span>
          <!-- éæ©åååç±»ççº§èéæ©æ¡ -->
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tabs é¡µç­¾åºå -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- æ·»å å¨æåæ°çé¢æ¿ -->
        <el-tab-pane label="å¨æåæ°" name="many">
          <!--  æ·»å åæ°çæé® -->
          <el-button
            style="padding: 10px"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >æ·»å åæ°</el-button
          >
          <!-- å¨æåæ°è¡¨æ ¼ -->
          <el-table :data="manyTableData" border stripe>
            <!-- å±å¼è¡ -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- å¾ªç¯æ¸²æ tagæ ç­¾ -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- è¾å¥ææ¬æ¡ -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- æ·»å çæé®  -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- ç´¢å¼å -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="åæ°åç§°"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="æä½">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-adit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >ç¼è¾</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >å é¤</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- æ·»å éæå±æ§çé¢æ¿ -->
        <el-tab-pane label="éæå±æ§" name="only">
          <!--  æ·»å å±æ§çæé® -->
          <el-button
            style="padding: 10px"
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >æ·»å å±æ§</el-button
          >
          <!-- éæå±æ§è¡¨æ ¼ -->
          <el-table :data="onlyTableData" border stripe>
              <!-- å±å¼è¡ -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- å¾ªç¯æ¸²æ tagæ ç­¾ -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- è¾å¥ææ¬æ¡ -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- æ·»å çæé®  -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- ç´¢å¼å -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="å±æ§åç§°"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="æä½">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-adit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >ç¼è¾</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >å é¤</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- *æ·»å åæ°çå¯¹è¯æ¡ -->
    <el-dialog
      :title="'æ·»å ' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- æ·»å åæ°çå¯¹è¯æ¡ -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">å æ¶</el-button>
        <el-button type="primary" @click="addParams">ç¡® å®</el-button>
      </span>
    </el-dialog>

    <!-- *ç¼è¾åæ°çå¯¹è¯æ¡ -->
    <el-dialog
      :title="'ä¿®æ¹' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- æ·»å åæ°çå¯¹è¯æ¡ -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">å æ¶</el-button>
        <el-button type="primary" @click="editParams">ç¡® å®</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // åååç±»åè¡¨
      cateList: [],
      // çº§èéæ©æ¡çéç½®å¯¹è±¡
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // çº§èéæ©æ¡ååç»å®å°çæ°ç»
      selectedCateKeys: [],
      // è¢«æ¿æ´»çé¡µç­¾åç§°
      activeName: 'many',
      // å¨æåæ°æ°æ®
      manyTableData: [],
      // éæå±æ§æ°æ®
      onlyTableData: [],
      // æ§å¶æ·»å å¯¹è¯æ¡çæ¾ç¤ºä¸éè
      addDialogVisible: false,
      // æ·»å åæ°çè¡¨åæ°æ®å¯¹è±¡
      addForm: {
        attr_name: ''
      },
      // æ·»å è¡¨åçéªè¯è§åå¯¹è±¡
      addFormRules: {
        attr_name: [
          { required: true, message: 'è¯·è¾å¥åæ°åç§°', trigger: 'blur' }
        ]
      },
      // ------
      // ä¿®æ¹
      // ------
      // æ§å¶ä¿®æ¹å¯¹è¯æ¡çæ¾ç¤ºä¸éè
      editDialogVisible: false,
      // ä¿®æ¹çè¡¨åæ°æ®å¯¹è±¡
      editForm: {},
      // ä¿®æ¹è¡¨åçéªè¯è§åå¯¹è±¡
      editFormRules: {
        attr_name: [
          { required: true, message: 'è¯·è¾å¥åæ°åç§°', trigger: 'blur' }
        ]
      }
      // // æ§å¶æé®ä¸è¾å¥æ¡çåæ¢æ¾ç¤ºä¸éè
      // inputVisible: false,
      // // ææ¬æ¡è¾å¥çåå®¹
      // inputValue: ''
    }
  },

  created() {
    this.getCateList()
  },

  // æ¹æ³
  methods: {
    // è·åææçåååç±»åè¡¨
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('è·ååååç±»å¤±è´¥ï¼')
      }

      this.cateList = res.data

      console.log(this.cateList)
    },
    // çº§èéæ©æ¡éä¸­é¡¹ååï¼ä¼è§¦åè¯¥å½æ°
    handleChange() {
      this.getParamsData()
    },

    // tabé¡µç­¾ç¹å»äºä»¶çå¤çå½æ°
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // è·ååæ°åè¡¨æ°æ®
    async getParamsData() {
      // console.log(this.selectedCateKeys)
      // è¯æéä¸­çä¸æ¯ä¸çº§åç±»
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // è¯æéä¸­çæ¯ä¸çº§åç±»
      console.log(this.selectedCateKeys)
      // æ ¹æ®æéåç±»çid,åå½åæå¤çé¢æ¿ï¼è·åå¯¹åºçåæ°
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )

      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('è·ååæ°åè¡¨å¤±è´¥ï¼')
      }

      console.log('åæ°åè¡¨:', res.data)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // æ§å¶ææ¬æ¡çæ¾ç¤ºä¸éè
        item.inputVisible = false
        // ææ¬æ¡è¾å¥çå¼
        item.inputValue = ''
      })
      console.log('åæ°åè¡¨:', res.data)

      // å¤æ­æ°æ®æ¯é£ä¸ªè¡¨æ ¼çæ°æ®,
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // çå¬æ·»å å¯¹è¯æ¡ççå¬äºä»¶
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // ç¹å»æé®æ·»å åæ°
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('æ·»å åæ°å¤±è´¥ï¼')
        }

        this.$message.success('æ·»å åæ°æåï¼')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // ------
    // ç¹å»æé®ï¼å±ç¤ºå¯¹è¯æ¡
    async showEditDialog(id) {
      // æ¥è¯¢å½ååæ°çä¿¡æ¯
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('è·ååæ°ä¿¡æ¯å¤±è´¥ï¼')
      }
      //  å°ä¿¡æ¯ä¿å­å¨ç¼è¾çè¡¨åå¯¹è±¡èº«ä¸
      this.editForm = res.data

      // å³é­å¯¹è¯æ¡
      this.editDialogVisible = true
    },
    // éç½®ä¿®æ¹çè¡¨å
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // ç¹å»æé®ï¼ç¡®è®¤ä¿®æ¹åæ°ä¿¡æ¯
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('ä¿®æ¹åæ°å¤±è´¥ï¼')
        }

        this.$message.success('ä¿®æ¹åæ°æå')
        // å·æ°åæ°æ°æ®åè¡¨
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // ç¹å»æé®ï¼æ ¹æ®id å é¤å¯¹åºçåæ° ç¡®è®¤å é¤åæ°ä¿¡æ¯
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        'æ­¤æä½å°æ°¸ä¹å é¤è¯¥åæ°, æ¯å¦ç»§ç»­?',
        'æç¤º',
        {
          confirmButtonText: 'ç¡®å®',
          cancelButtonText: 'åæ¶',
          type: 'warning'
        }
      ).catch((err) => err)

      console.log('$$$', confirmResult, typeof confirmResult)

      // ç¨æ·åæ¶å é¤æä½
      if (confirmResult !== 'confirm') {
        return this.$message.info('å·²åæ¶å é¤')
      }

      // å é¤çä¸å¡é»è¾
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )

      console.log('####', res)

      if (res.meta.status !== 200) {
        return this.$message.error('å é¤åæ°å¤±è´¥ï¼')
      }

      this.$message.success('å é¤åæ°æåï¼')
      this.getParamsData()
    },
    // ææ¬æ¡å¤±å»ç¦ç¹è·åæä¸åè½¦é½ä¼è§¦å
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // è¾å¥æ¡ä¸ä¸ºç©º
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // éè¦åèµ·è¯·æ±,ä¿å­è¿æ¬¡æä½
      this.saveAttrVals(row)
      // const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
      //   attr_name: row.attr_name,
      //   attr_sel: row.attr_sel,
      //   attr_vals: row.attr_vals.join(' ')
      // })

      // if (res.meta.status !== 200) {
      //   return this.$message.error('ä¿®æ¹åæ°é¡¹å¤±è´¥ï¼')
      // }
      // this.$message.success('ä¿®æ¹åæ°é¡¹æåï¼')
      // // ----
      // console.log('ok')
    },
    // --------
    // å° attr_vals çæä½ä¿å­å°æ°æ®åº
    async saveAttrVals(row) {
      // éè¦åèµ·è¯·æ±,ä¿å­è¿æ¬¡æä½
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })

      if (res.meta.status !== 200) {
        return this.$message.error('ä¿®æ¹åæ°é¡¹å¤±è´¥ï¼')
      }
      this.$message.success('ä¿®æ¹åæ°é¡¹æåï¼')
      // ----
      console.log('ok')
    },
    // --------
    // æé®æä¸è¾å¥
    showInput(row) {
      // è¾å¥æ¡åæ¢
      row.inputVisible = true
      // è®©ææ¬æ¡èªå¨è·å¾ç¦ç¹
      // $nextTickçä½ç¨ï¼ å½é¡µé¢ä¸åç´ è¢«éæ°æ¸²æä¹åï¼æä¼æ§è¡åè°å½æ°ä¸­çä»£ç 
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // å é¤å¯¹åºåæ°çå¯éé¡¹
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },

  // è®¡ç®
  computed: {
    // å¦ææé®è¢«ç¦ç¨ï¼åæ¾åtrue
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // å½åéæ©çä¸çº§åç±»çID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // å¨æè®¡ç®æ é¢çææ¬
    titleText() {
      if (this.activeName === 'many') {
        return 'å¨æåæ°'
      }
      return 'éæå±æ§'
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
  padding: 10px !important;
}
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 6px;
}
.input-new-tag {
  width: 120px;
}
</style>
