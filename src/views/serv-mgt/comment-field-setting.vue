<route lang="yaml">
meta:
  enabled: false
    </route>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

export default {
  data() {
    return {
      showEditDialog: false,
      showSelectDictCollectionDialog: false,
      showDictItemsDialog: false,
      batchBtnEnable: false,
      dataList: [],
      editColumnId: 0,
      dictCollectionList: [],
      dictItemList: [],
      selectedRows: [],
      editDetail: { },
      jsonContent: '',
      showJsonDialog: false,
      editFieldRules: {
        columnCode: [{ required: true, message: '字段编码必填，代码层面处理使用，请输入英文字符和数字', trigger: 'blur' }],
        showName: [{ required: true, message: '字段显示名称必填', trigger: 'blur' }],
      },
    }
  },
  computed: {

  },
  mounted() {
    this.clickSearch()
  },
  methods: {
    loadDataList() {
      api.get('server/column/queryColumns').then((res) => {
        this.dataList = res.data
      })
    },
    clickSearch() {
      this.loadDataList()
    },
    getSelectedRows(val:any) {
      this.selectedRows = val
      if (this.selectedRows && this.selectedRows.length !== 0) {
        this.batchBtnEnable = true
      }
      else {
        this.batchBtnEnable = false
      }
    },
    deleteSelection(val:any) {
      ElMessageBox.confirm(
        '确定要删除所选字段定义吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          const ids = []
          for (let index = 0; index < this.selectedRows.length; index++) {
            const element:any = this.selectedRows[index]
            ids.push(element.id)
          }
          api.get(`server/column/deleteColumns?columnIds=${ids}`).then((resp:any) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '删除成功',
              })
            }
            else {
              ElMessage({
                type: 'error',
                message: `删除失败：${resp.message}`,
              })
            }
            this.clickSearch()
          })
        })
        .catch(() => {

        })
    },
    deleteSingle(val: { id: any }) {
      ElMessageBox.confirm(
        '确定要删除此字段额定定义吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/column/deleteColumn?columnId=${val.id}`).then((resp:any) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '删除成功',
              })
            }
            else {
              ElMessage({
                type: 'error',
                message: `删除失败：${resp.message}`,
              })
            }
            this.clickSearch()
          })
        })
        .catch(() => {

        })
    },
    editSingle(val:any) {
      api.get(`server/column/queryColumn?columnId=${val.id}`).then((resp:any) => {
        this.editDetail = resp.data
        this.editColumnId = val.id
        this.showEditDialog = true
      }).catch((reason) => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${reason}`,
        })
      })
    },
    saveEditOperation() {
      (this.$refs.editDetailForm as any).validate((valid:any) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post(`server/column/createOrModifyColumn?columnId=${this.editColumnId}`, this.editDetail).then((resp:any) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              this.showEditDialog = false
              this.clickSearch()
            }
            else {
              ElMessage({
                type: 'error',
                message: `编辑失败：${resp.message}`,
              })
            }
          })
        }
      })
    },
    cancelEditOperation() {
      this.showEditDialog = false
    },
    create() {
      this.editDetail = {
        sortIndex: 1,
        excelColumnWidth: 50,
        webTableColumnWidth: 200,
        systemInitialization: false,
      }
      this.editColumnId = 0
      this.showEditDialog = true
    },

    selectDictCollection() {
      api.get('server/dict/queryDictCollections').then((res:any) => {
        this.dictCollectionList = res.data
      })

      this.showSelectDictCollectionDialog = true
    },

    showDictCollectionItems(collCode:any) {
      api.get(`server/dict/queryDictItems?collectionCode=${collCode}`).then((res:any) => {
        this.dictItemList = res.data
      })

      this.showDictItemsDialog = true
    },

    bindDictCollection(collCode:any) {
      (this.editDetail as any).dictCollectionCode = collCode
      this.showSelectDictCollectionDialog = false
    },

    showInJson() {
      api.get('server/column/getJsonContent').then((res:any) => {
        this.jsonContent = res.data
      })
      this.showJsonDialog = true
    },
    closeJsonDialog() {
      this.showJsonDialog = false
    },
  },

}
</script>

<template>
  <div>
    <page-header title="评审字段配置" content="本页面提供对评审插件支持的字段进行自定义配置，定制更加符合自己实际使用场景的评审字段信息。" />

    <page-main>
      <div class="button-group">
        <el-button type="primary" @click="create">
          <template #icon>
            <el-icon>
              <svg-icon name="ep:circle-plus" />
            </el-icon>
          </template>
          新建
        </el-button>
        <el-button type="danger" :disabled="!batchBtnEnable" @click="deleteSelection">
          <template #icon>
            <el-icon>
              <svg-icon name="ep:delete" />
            </el-icon>
          </template>
          删除所选
        </el-button>

        <el-button type="text" @click="showInJson">
          <template #icon>
            <el-icon>
              <svg-icon name="ep:delete" />
            </el-icon>
          </template>
          显示JSON内容
        </el-button>
      </div>

      <el-table border highlight-current-row :data="dataList" height="100%" @selection-change="getSelectedRows">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column fixed prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="columnCode" label="字段编码" width="120" align="center" />
        <el-table-column prop="showName" label="显示名称" min-width="160" align="center" />
        <el-table-column prop="sortIndex" label="排序" width="70" align="center" />

        <el-table-column prop="systemInitialization" label="系统预置" width="90" align="center">
          <template #default="scope">
            <p v-if="scope.row.systemInitialization === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.systemInitialization === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>

        <el-table-column prop="inputType" label="输入类型" width="90" align="center">
          <template #default="scope">
            <p v-if="scope.row.inputType === 'TEXT'">
              单行文本
            </p>
            <p v-if="scope.row.inputType === 'COMBO_BOX'">
              下拉框
              <el-button link type="primary" size="small" @click="showDictCollectionItems(scope.row.dictCollectionCode)">
                取值范围
              </el-button>
            </p>
            <p v-if="scope.row.inputType === 'TEXTAREA'">
              多行文本
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="必填" width="60" align="center">
          <template #default="scope">
            <p v-if="scope.row.required === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.required === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInIdeaTable" label="IDEA表格中显示" width="150" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInIdeaTable === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.showInIdeaTable === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInWebTable" label="Web端表格中显示" width="150" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInWebTable === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              <el-tag class="tag-style">
                显示列宽：{{ scope.row.webTableColumnWidth }}
              </el-tag>
            </p>
            <p v-if="scope.row.showInWebTable === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInAddPage" label="新增界面" width="110" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInAddPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              显示
            </p>
            <p v-if="scope.row.showInAddPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
              显示
            </p>
            <p v-if="scope.row.editableInAddPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              编辑
            </p>
            <p v-if="scope.row.editableInAddPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
              编辑
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInEditPage" label="编辑界面" width="110" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInEditPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              显示
            </p>
            <p v-if="scope.row.showInEditPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
              显示
            </p>
            <p v-if="scope.row.editableInEditPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              编辑
            </p>
            <p v-if="scope.row.editableInEditPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
              编辑
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInConfirmPage" label="确认界面" width="110" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInConfirmPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              显示
            </p>
            <p v-if="scope.row.showInConfirmPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
              显示
            </p>
            <p v-if="scope.row.editableInConfirmPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              编辑
            </p>
            <p v-if="scope.row.editableInConfirmPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
              编辑
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="supportInExcel" label="支持导出到表格" width="140" align="center">
          <template #default="scope">
            <p v-if="scope.row.supportInExcel === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
              <br>
              <el-tag class="tag-style">
                导出列宽：{{ scope.row.excelColumnWidth }}
              </el-tag>
            </p>
            <p v-if="scope.row.supportInExcel === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editSingle(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="deleteSingle(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-main>

    <el-dialog v-model="showEditDialog" title="字段信息维护">
      <el-form ref="editDetailForm" :model="editDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="12">
          <el-form-item label="字段编码" prop="columnCode" :rules="editFieldRules.columnCode">
            <el-input v-model="(editDetail as any).columnCode" placeholder="输入字段编码" maxlength="64" show-word-limit :disabled="(editDetail as any).systemInitialization" />
            <el-aside v-if="(editDetail as any).systemInitialization" style="color: red;">
              系统预置字段不允许修改字段编码值
            </el-aside>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示名称" prop="showName" :rules="editFieldRules.showName">
            <el-input v-model="(editDetail as any).showName" placeholder="输入显示名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="字段排序" prop="sortIndex" :rules="(editFieldRules as any).sortIndex">
            <el-input v-model="(editDetail as any).sortIndex" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="系统预置">
            <el-radio-group v-model="(editDetail as any).systemInitialization" readonly="true" disabled>
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="输入类型">
            <el-radio-group v-model="(editDetail as any).inputType">
              <el-radio label="TEXT" size="large">
                单行文本框
              </el-radio>
              <el-radio label="TEXTAREA" size="large">
                多行文本框
              </el-radio>
              <el-radio label="COMBO_BOX" size="large">
                下拉选择框
              </el-radio>
            </el-radio-group>
            <div v-if="(editDetail as any).inputType === 'COMBO_BOX'" class="select-collection-button">
              <div v-if="(editDetail as any).dictCollectionCode">
                已绑定：{{ (editDetail as any).dictCollectionCode }}
                <el-button link type="primary" size="small" @click="showDictCollectionItems((editDetail as any).dictCollectionCode)">
                  查看
                </el-button>

                <el-button link type="warning" size="small" @click="selectDictCollection()">
                  更换
                </el-button>
              </div>
              <div v-if="!(editDetail as any).dictCollectionCode">
                未绑定
                <el-button link type="danger" size="small" @click="selectDictCollection()">
                  点击绑定
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="是否必填">
            <el-radio-group v-model="(editDetail as any).required">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="IDEA表格中显示">
            <el-radio-group v-model="(editDetail as any).showInIdeaTable">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Web表格中显示">
            <el-radio-group v-model="(editDetail as any).showInWebTable">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
            <div v-if="(editDetail as any).showInWebTable === true" class="select-collection-button">
              <el-form-item label="Web表格占用宽度" label-width="200">
                <el-input v-model="(editDetail as any).webTableColumnWidth" type="number" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="新增界面显示">
            <el-radio-group v-model="(editDetail as any).showInAddPage">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="新增界面可编辑">
            <el-radio-group v-model="(editDetail as any).editableInAddPage">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="编辑界面显示">
            <el-radio-group v-model="(editDetail as any).showInEditPage">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="编辑界面可编辑">
            <el-radio-group v-model="(editDetail as any).editableInEditPage">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="确认界面显示">
            <el-radio-group v-model="(editDetail as any).showInConfirmPage">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="确认界面可编辑">
            <el-radio-group v-model="(editDetail as any).editableInConfirmPage">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="支持导出到表格">
            <el-radio-group v-model="(editDetail as any).supportInExcel">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
            <div v-if="(editDetail as any).supportInExcel === true" class="select-collection-button">
              <el-form-item label="导出Excel列宽">
                <el-input v-model="(editDetail as any).excelColumnWidth" type="number" />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelEditOperation">
            取消
          </el-button>
          <el-button type="primary" @click="saveEditOperation">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="showSelectDictCollectionDialog" title="绑定字典集">
      <el-table border highlight-current-row :data="dictCollectionList" height="100%">
        <el-table-column fixed prop="code" label="字典集编码" width="200" />
        <el-table-column prop="name" label="字典集名称" width="360" />
        <el-table-column prop="dictDesc" label="描述说明" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="bindDictCollection(scope.row.code)">
              绑定
            </el-button>
            <el-button link type="primary" size="small" :disabled="scope.row.type === 1" @click="showDictCollectionItems(scope.row.code)">
              字典值查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="showDictItemsDialog" title="字典值列表查看">
      <el-table border highlight-current-row :data="dictItemList" height="100%">
        <el-table-column fixed prop="value" label="值" width="200" />
        <el-table-column fixed prop="showName" label="显示名称" width="200" />
        <el-table-column fixed prop="itemDesc" label="含义描述" width="300" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="showJsonDialog" title="字段配置JSON格式查看">
      <el-input v-model="jsonContent" readonly type="textarea" :rows="30" />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeJsonDialog">
            关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

    <style lang="scss" scoped>
    .page-common-style {
        padding: 20px;
        margin: 20px;
    }

    .pageination-style {
        margin-top: 20px;
    }

    .button-group {
        margin-bottom: 20px;
    }

    .tag-style {
        margin-left: 5px;
        margin-right: 5px;
    }

    .select-collection-button {
      padding-left: 30px;
    }
    </style>
