<template>
  <div>
    <!-- ðé¢åå±å¯¼èªåº -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">é¦é¡µ</el-breadcrumb-item>
      <el-breadcrumb-item>ååç®¡ç</el-breadcrumb-item>
      <el-breadcrumb-item>æ·»å åå</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- ð³å¡çè§å¾åºå -->
    <el-card>
      <!-- æç¤ºåºå -->
      <el-alert
        title="æ·»å ååä¿¡æ¯"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- æ­¥éª¤æ¡åºå -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="åºæ¬ä¿¡æ¯"></el-step>
        <el-step title="åååæ°"></el-step>
        <el-step title="ååå±æ§"></el-step>
        <el-step title="ååå¾ç"></el-step>
        <el-step title="åååå®¹"></el-step>
        <el-step title="å®æ"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabæ  åºå-->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- ç¬¬ä¸ä¸ªåºæ¬ä¿¡æ¯ -->
          <el-tab-pane label="åºæ¬ä¿¡æ¯" name="0">
            <el-form-item label="åååç§°" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="ååä»·æ ¼" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="ååéé" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="ååæ°é" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="åååç±»" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- ç¬¬äºä¸ªåååæ° -->
          <el-tab-pane label="åååæ°" name="1">
            <!-- æ¸²æè¡¨åçitemé¡¹ -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
            <!-- å¤éæ¡ç» -->
              <el-checkbox-group v-model="item.attr_vals">
               <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>
          <!-- æ¥çååå±æ§ -->
          <el-tab-pane label="ååå±æ§" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- ä¸ä¼ ååå¾ç -->
          <el-tab-pane label="ååå¾ç" name="3">
             <!-- action è¡¨ç¤ºå¾æ è¦ä¸ä¼ çåå°APIå°å-->
             <!-- å¨çº¿ï¼https://lianghj.top:8888/api/private/v1/upload -->
             <!-- on-preview : å¾çé¢è§ -->
            <!-- list-typeï¼æ¸²æå¾çææ -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
              >
              <el-button size="small" type="primary">ç¹å»ä¸ä¼ </el-button>
            </el-upload>
          </el-tab-pane>
          <!--  -->
          <el-tab-pane label="åååå®¹" name="4">
            <!-- å¯ææ¬ç¼è¾å¨ç»ä»¶ -->
             <quill-editor v-model="addForm.goods_introduce"></quill-editor>
             <!-- æ·»å ååçæé® -->
             <el-button type="primary" class="btnAdd" @click="add">æ·»å åå</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- ð³å¡çè§å¾åºå ç»æ-->
    </el-card>

    <!-- å¾çé¢è§  -->
    <el-dialog
      title="å¾çé¢è§"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// å¼å¥ lodash
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      // *æ·»å ååçè¡¨åæ°æ®å¯¹è±¡
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // ååæå±çåç±»æ°ç»
        goods_cat: [],
        // å¾ççæ°ç»
        pics: [],
        // ç¼è¾å¨ ååçè¯¦ææè¿°
        goods_introduce: '',
        attrs: []
      },
      // æ ¡éªè§å
      addFormRules: {
        goods_name: [
          { required: true, message: 'è¯·è¾å¥åååç§°', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: 'è¯·è¾å¥ååä»·æ ¼', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: 'è¯·è¾å¥ååéé', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: 'è¯·è¾å¥ååæ°é', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: 'è¯·éæ©åååç±»', trigger: 'blur' }
        ]
      },
      // ææåååç±»æ°æ®åè¡¨
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // å¨æåæ°åè¡¨æ°æ®
      manyTableData: [],
      // éæå±æ§åè¡¨æ°æ®
      onlyTableData: [],
      // ä¸ä¼ å¾ççurlå°å
      //   å¨çº¿ï¼https://lianghj.top:8888/api/private/v1/upload
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      // å¾çä¸ä¼ ç»ä»¶çheadersè¯·æ±å¤´å¯¹è±¡
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // å¾çé¢è§å°å
      previewPath: '',
      previewDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      // è·åææåååç±»æ°æ®
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('è·ååååç±»æ°æ®å¤±è´¥ï¼')
      }

      this.cateList = res.data

      console.log(this.cateList)
    },
    // *çº§èéæ©å¨éæ©é¡¹ï¼ååä¼è§¦åè¯¥å½æ°
    handleChange() {
      console.log(this.addForm.goods_cat)

      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // *åæ¢å·¦è¾¹ç
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)

      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('è¯·åéæ©åååç±»ï¼')
        return false
      }
    },
    // *ç¹å»ï¼è·åå¨æåæ° éæå±æ§
    async tabClicked() {
      console.log(this.activeIndex)
      // è¯æè®¿é®çæ¯å¨æåæ°é¢æ¿
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('è·åå¨æåæ°åè¡¨å¤±è´¥ï¼')
        }

        console.log(res)

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        // this.$message.success('è·åå¨æåæ°åè¡¨æåï¼')
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('è·åéæå±æ§åè¡¨å¤±è´¥ï¼')
        }
        console.log(res.data)

        this.onlyTableData = res.data
      }
    },
    // *å¤çå¾çé¢è§ææ
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // *ç§»é¤å¾çæä½
    handleRemove(file) {
      // 1.è·åå°è¦å é¤çå¾ççä¸´æ¶è·¯å¾
      const filePath = file.response.data.tmp_path
      // 2.ä» pics æ°ç»ä¸­ï¼æ¾å°è¿ä¸ªå¾çå¯¹åºçç´¢å¼å¼
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.è°ç¨æ°ç»ç splice æ¹æ³ æå¾çä¿¡æ¯å¯¹è±¡ï¼ ä» pics æ°ç»ä¸­ç§»é¤
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // *çå¬å¾çä¸ä¼ çäºä»¶
    handleSuccess(response) {
      console.log(response)
      // 1.æ¼æ¥å¾å°ä¸ä¸ªå¾çä¿¡æ¯å¯¹è±¡
      const picInfo = { pic: response.data.tmp_path }
      // 2.å°å¾çä¿¡æ¯å¯¹è±¡push å° PICS æ°ç»ä¸­
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // * æ·»å åå
    add() {
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('è¯·å¡«åå¿è¦çè¡¨åé¡¹ï¼')
        }
        // æ§è¡æ·»å çä¸å¡é»è¾
        // lodash  cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // å¤çå¨æåæ°
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join('') }
          this.addForm.attrs.push(newInfo)
        })
        // å¤çéæå±æ§
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        // èµå¼æä½
        form.attrs = this.addForm.attrs
        console.log(form)

        // åèµ·è¯·æ±,æ·»å åå
        // *ï¼æ³¨æï¼ååçåç§°===>>>å¿é¡»æ¯å¯ä¸ç
        const { data: res } = await this.$http.post('goods', form)

        console.log('$$$$', res)

        // å¤æ­
        if (res.meta.status !== 201) {
          return this.$message.error('æ·»å ååå¤±è´¥!')
        }

        this.$message.success('æ·»å ååæåï¼')
        // éè¿ç¼ç¨å¼å¯¼èª è·³è½¬å°ååé¡µé¢
        this.$router.push('/goods')
      })
    }
  },
  // è®¡ç®å±æ§
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin-right: 5px !important;
}
.previewImg{
  width: 100%;
  height: 100%;
}
.btnAdd{
  margin: 15px 0;
}

</style>
