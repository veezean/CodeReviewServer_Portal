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
    getSelectedRows(val) {
      this.selectedRows = val
      if (this.selectedRows && this.selectedRows.length !== 0) {
        this.batchBtnEnable = true
      }
      else {
        this.batchBtnEnable = false
      }
    },
    deleteSelection(val) {
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
            const element = this.selectedRows[index]
            ids.push(element.id)
          }
          api.get(`server/column/deleteColumns?columnIds=${ids}`).then((resp) => {
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
          api.get(`server/column/deleteColumn?columnId=${val.id}`).then((resp) => {
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
    editSingle(val) {
      api.get(`server/column/queryColumn?columnId=${val.id}`).then((resp) => {
        this.editDetail = resp.data
        this.editColumnId = val.id
        this.showEditDialog = true
      }).catch(() => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${resp.message}`,
        })
      })
    },
    saveEditOperation() {
      this.$refs.editDetailForm.validate((valid) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post(`server/column/createOrModifyColumn?columnId=${this.editColumnId}`, this.editDetail).then((resp) => {
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
      }
      this.editColumnId = 0
      this.showEditDialog = true
    },

    selectDictCollection() {
      api.get('server/dict/queryDictCollections').then((res) => {
        this.dictCollectionList = res.data
      })

      this.showSelectDictCollectionDialog = true
    },

    showDictCollectionItems(collCode) {
      api.get(`server/dict/queryDictItems?collectionCode=${collCode}`).then((res) => {
        this.dictItemList = res.data
      })

      this.showDictItemsDialog = true
    },

    bindDictCollection(collCode) {
      this.editDetail.dictCollectionCode = collCode
      this.showSelectDictCollectionDialog = false
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

        <el-table-column prop="showInTable" label="表格中显示" width="100" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInTable === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.showInTable === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInAddPage" label="新增界面显示" width="110" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInAddPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.showInAddPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="showInComfirmPage" label="确认界面显示" width="110" align="center">
          <template #default="scope">
            <p v-if="scope.row.showInComfirmPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.showInComfirmPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="editable" label="可编辑" width="70" align="center">
          <template #default="scope">
            <p v-if="scope.row.editable === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.editable === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="editableInConfirmPage" label="确认时可修改" width="110" align="center">
          <template #default="scope">
            <p v-if="scope.row.editableInConfirmPage === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.editableInConfirmPage === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>

        <el-table-column prop="confirmProp" label="仅确认界面显示" width="130" align="center">
          <template #default="scope">
            <p v-if="scope.row.confirmProp === true">
              <el-icon>
                <svg-icon name="table-support" />
              </el-icon>
            </p>
            <p v-if="scope.row.confirmProp === false">
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
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
            <el-input v-model="editDetail.columnCode" placeholder="输入字段编码" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示名称" prop="showName" :rules="editFieldRules.showName">
            <el-input v-model="editDetail.showName" placeholder="输入显示名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="字段排序" prop="sortIndex" :rules="editFieldRules.sortIndex">
            <el-input v-model="editDetail.sortIndex" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="系统预置">
            <el-radio-group v-model="editDetail.systemInitialization">
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
            <el-radio-group v-model="editDetail.inputType">
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
            <div v-if="editDetail.inputType === 'COMBO_BOX'" class="select-collection-button">
              <div v-if="editDetail.dictCollectionCode">
                已绑定：{{ editDetail.dictCollectionCode }}
                <el-button link type="primary" size="small" @click="showDictCollectionItems(editDetail.dictCollectionCode)">
                  查看
                </el-button>

                <el-button link type="warning" size="small" @click="selectDictCollection()">
                  更换
                </el-button>
              </div>
              <div v-if="!editDetail.dictCollectionCode">
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
            <el-radio-group v-model="editDetail.required">
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
          <el-form-item label="表格中显示">
            <el-radio-group v-model="editDetail.showInTable">
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
          <el-form-item label="新增界面显示">
            <el-radio-group v-model="editDetail.showInAddPage">
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
            <el-radio-group v-model="editDetail.showInComfirmPage">
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
          <el-form-item label="字段支持编辑">
            <el-radio-group v-model="editDetail.editable">
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
          <el-form-item label="确认时可编辑">
            <el-radio-group v-model="editDetail.editableInConfirmPage">
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
          <el-form-item label="仅确认界面显示">
            <el-radio-group v-model="editDetail.confirmProp">
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
            <el-radio-group v-model="editDetail.supportInExcel">
              <el-radio :label="true" size="large">
                是
              </el-radio>
              <el-radio :label="false" size="large">
                否
              </el-radio>
            </el-radio-group>
            <div v-if="editDetail.supportInExcel === true" class="select-collection-button">
              <el-form-item label="导出Excel列宽">
                <el-input v-model="editDetail.excelColumnWidth" type="number" />
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
            <el-button link type="primary" size="small" @click="showDictCollectionItems(scope.row.code)">
              字典值查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="showDictItemsDialog" title="字典值列表查看">
      <el-table border highlight-current-row :data="dictItemList" height="100%">
        <el-table-column fixed prop="itemKey" label="KEY" width="150" />
        <el-table-column fixed prop="itemValue" label="VALUE" width="200" />
        <el-table-column prop="itemDesc" label="描述说明" />
      </el-table>
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
