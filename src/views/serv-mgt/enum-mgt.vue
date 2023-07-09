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
      showManageDialog: false,
      batchBtnEnable: false,
      dataList: [],
      itemList: [],
      dialogType: '',
      manageCollectionCode: 0,
      editItemDetail: { },
      showEditItemDialog: false,
      itemDialogType: '',
      selectedRows: [],
      editDetail: { },
      editFieldRules: {
        code: [{ required: true, message: '字典集编码必填', trigger: 'blur' }],
        name: [{ required: true, message: '字典集名称必填', trigger: 'blur' }],
        value: [{ required: true, message: '字典值value必填', trigger: 'blur' }],
        showName: [{ required: true, message: '字典值showName必填', trigger: 'blur' }],
      },
    }
  },
  computed: {

  },
  mounted() {
    this.clickSearch()
  },
  methods: {
    loadListData() {
      api.get('server/dict/queryDictCollections').then((res) => {
        this.dataList = res.data
      })
    },
    clickSearch() {
      this.loadListData()
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
        '确定要删除所选字典集吗？将同时删除此字典集下所有字典值。此操作不可恢复！',
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
          api.get(`server/dict/deleteCollections?ids=${ids}`).then((resp:any) => {
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
        '确定要删除此字典集吗？将同时删除此字典集下所有字典值。此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/dict/deleteCollection?id=${val.id}`).then((resp:any) => {
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
      api.get(`server/dict/queryDictCollection?collectionCode=${val.code}`).then((resp:any) => {
        this.editDetail = {
          code: resp.data.code,
          name: resp.data.name,
          dictDesc: resp.data.dictDesc,
          id: resp.data.id,
          type: resp.data.type,
        }
        this.dialogType = 'EDIT'
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
          let reqUrl = 'server/dict/modifyDictCollection'
          if (this.dialogType === 'CREATE') {
            reqUrl = 'server/dict/createDictCollection'
          }
          api.post(reqUrl, this.editDetail).then((resp:any) => {
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
        name: '',
        code: '',
        dictDesc: '',
        type: 0,
      }
      this.dialogType = 'CREATE'
      this.showEditDialog = true
    },
    cancelCreateOperation() {
      this.showEditDialog = false
    },

    loadItemList() {
      api.get(`server/dict/queryDictItems?collectionCode=${this.manageCollectionCode}`).then((res) => {
        this.itemList = res.data
      })
    },

    itemManage(val:any) {
      this.manageCollectionCode = val.code
      this.loadItemList()
      this.showManageDialog = true
    },

    deleteSingleItem(val: { id: any }) {
      ElMessageBox.confirm(
        '确定要删除此字典值吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/dict/deleteDictItem?dictItemId=${val.id}`).then((resp:any) => {
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
            this.loadItemList()
          })
        })
        .catch(() => {

        })
    },

    saveEditItemOperation() {
      (this.$refs.editItemDetailForm as any).validate((valid:any) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post('server/dict/createOrModifyDictItem', this.editItemDetail).then((resp:any) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              this.showEditItemDialog = false
              this.loadItemList()
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
    createItem() {
      this.editItemDetail = {
        value: '',
        showName: '',
        itemDesc: '',
        sort: 0,
        collectionCode: this.manageCollectionCode,
      }
      this.itemDialogType = 'CREATE'
      this.showEditItemDialog = true
    },
    editSingleItem(val:any) {
      api.get(`server/dict/queryDictItem?itemId=${val.id}`).then((resp:any) => {
        this.editItemDetail = resp.data
        this.itemDialogType = 'EDIT'
        this.showEditItemDialog = true
      }).catch((reason) => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${reason}`,
        })
      })
    },
    cancelEditItemOperation() {
      this.showEditItemDialog = false
    },
  },

}
</script>

<template>
  <div>
    <page-header title="字典值管理" content="本页面提供对字典集以及字典值列表的维护能力，字典可以用于下拉框类型的字段使用，用来定义下拉框的候选值。" />

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
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="id" label="ID" width="200" />
        <el-table-column fixed prop="code" label="字典集编码" width="200" />
        <el-table-column prop="name" label="字典集名称" width="360" />
        <el-table-column prop="type" label="字典集类型" width="200">
          <template #default="scope">
            <p v-if="scope.row.type === 0">
              手动配置枚举项
            </p>
            <p v-else-if="scope.row.type === 1">
              系统预置动态列表
            </p>
            <p v-else>
              <el-icon>
                <svg-icon name="table-not-support" />
              </el-icon>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="dictDesc" label="描述说明" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editSingle(scope.row)">
              编辑
            </el-button>
            <el-button link type="primary" size="small" :disabled="scope.row.type === 1" @click="itemManage(scope.row)">
              字典值管理
            </el-button>
            <el-button link type="danger" size="small" @click="deleteSingle(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-main>

    <el-dialog v-model="showEditDialog" :title="dialogType === 'CREATE' ? '创建字典集' : '编辑字典集' ">
      <el-form ref="editDetailForm" :model="editDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="18">
          <el-form-item label="字典集编码" prop="code" :rules="editFieldRules.code">
            <el-input v-model="(editDetail as any).code" :disabled="dialogType === 'EDIT'" placeholder="输入字典集编码,允许英文和数字" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="字典集名称" prop="name" :rules="editFieldRules.name">
            <el-input v-model="(editDetail as any).name" placeholder="输入字典集名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="字典集类型" prop="type">
            <el-radio-group v-model="(editDetail as any).type">
              <el-radio :label="0" size="large">
                手动配置枚举项
              </el-radio>
              <el-radio :label="1" size="large">
                系统预置动态列表
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="字典集描述">
            <el-input v-model="(editDetail as any).dictDesc" type="textarea" :rows="3" placeholder="输入简要描述信息" clearable maxlength="256" show-word-limit />
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

    <el-dialog v-model="showManageDialog" title="字典值管理" width="1200px">
      <div>
        <page-main>
          <div class="button-group">
            <el-button type="primary" @click="createItem">
              <template #icon>
                <el-icon>
                  <svg-icon name="ep:circle-plus" />
                </el-icon>
              </template>
              新建
            </el-button>
          </div>

          <el-table border highlight-current-row :data="itemList" @selection-change="getSelectedRows">
            <el-table-column fixed prop="value" label="值" width="150" />
            <el-table-column fixed prop="showName" label="显示名称" width="200" />
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column prop="itemDesc" label="含义描述说明" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="editSingleItem(scope.row)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="deleteSingleItem(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </page-main>
      </div>
    </el-dialog>

    <el-dialog v-model="showEditItemDialog" :title="itemDialogType === 'CREATE' ? '新增字典值' : '编辑字典值' ">
      <el-form ref="editItemDetailForm" :model="editItemDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="18">
          <el-form-item label="值" prop="value" :rules="editFieldRules.value">
            <el-input v-model="(editItemDetail as any).value" :disabled="itemDialogType !== 'CREATE'" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="显示名称" prop="showName" :rules="editFieldRules.showName">
            <el-input v-model="(editItemDetail as any).showName" placeholder="输入字典值显示名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="排序" prop="sort" :rules="(editFieldRules as any).sort">
            <el-input v-model="(editItemDetail as any).sort" placeholder="输入排序值" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="字典值含义描述">
            <el-input v-model="(editItemDetail as any).itemDesc" type="textarea" :rows="3" placeholder="输入简要描述信息" clearable maxlength="256" show-word-limit />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelEditItemOperation">
            取消
          </el-button>
          <el-button type="primary" @click="saveEditItemOperation">
            保存
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
    </style>
