<route lang="yaml">
meta:
  enabled: false
    </route>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
export default {
  data() {
    return {
      columnFields: [],
      commentsData: {
        list: [],
        currPage: 1,
        pageSize: 20,
        total: 0,
        totalPage: 0,
      },
      showEditDialog: false,
      dialogTitle: '',
      dialogType: '',
      batchBtnEnable: false,
      search: {
        pageSize: 20,
        pageIndex: 1,
        sortBy: 'createTime',
        sortType: 'desc',
        queryParams: {
        },
      },

      departmentTree: {

      },
      listProjects: [],
      listUsers: [],
      selectedRoles: [],
      confirmResultItems: [],
      selectedRows: [],
      editDetail: { },
      editFieldRules: {
        name: [{ required: true, message: '用户姓名必填', trigger: 'blur' }],
        account: [{ required: true, message: '用户账号必填', trigger: 'blur' }],
      },
      languageType:'java',
    }
  },
  computed: {

  },
  mounted() {
    this.resetSearch()
    this.getColumnFields()
    this.loadUserList()
    this.loadProjects()
    this.loadConfirmResultItems()
    this.loadDepartmentTree()
  },
  methods: {
    loadUserList() {
      api.get('server/user/getAllUserDetails').then((res) => {
        this.listUsers = res.data
      })
    },

    loadProjects() {
      api.get(`server/project/queryProjectInDept?deptId=${(this.search.queryParams as any).departmentId}`).then((res) => {
        this.listProjects = res.data
      })
    },

    loadConfirmResultItems() {
      api.get('server/column/queryConfirmResultDictItems').then((res) => {
        this.confirmResultItems = res.data
      })
    },

    getColumnFields() {
      api.get('server/column/queryColumns').then((res) => {
        this.columnFields = res.data
      })
    },
    loadDepartmentTree() {
      api.get('server/dept/getDeptTree').then((res) => {
        this.departmentTree = res.data
      })
    },
    clickSearch() {
      api.post('/server/comment/queryComments', this.search).then((res) => {
        this.commentsData = res.data
      })
    },
    resetSearch() {
      this.search.queryParams = {
        identifier: null,
        projectId: null,
        departmentId: null,
        commitUser: userStore.account,
        realConfirmUser: null,
        assignConfirmUser: null,
        confirmResult: null,
      }
      this.clickSearch()
    },
    handleSizeChange(val: number) {
      this.search.pageSize = val
      this.clickSearch()
    },
    handleCurrentChange(val: number) {
      this.search.pageIndex = val
      this.clickSearch()
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
    exportData(val:any) {
      api.post('/server/comment/exportComments', this.search, {responseType:'blob'}).then((res) => {
          let  fileName = "review_comment_" + Date.now() + ".xlsx";

          let blob = new Blob([res as any]);
          if ('msSaveOrOpenBlob' in navigator) {
            (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
          } else {
            let url = window.URL.createObjectURL(blob); // 创建 url 并指向 blob
            let a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url); // 释放该 url
          }
      })
    },
    deleteSelection(val:any) {
      ElMessageBox.confirm(
        '确定要删除所选记录吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          const identifiers = []
          for (let index = 0; index < this.selectedRows.length; index++) {
            const element:any = this.selectedRows[index]
            identifiers.push(element.identifier)
          }
          api.get(`server/comment/deleteComments?identifiers=${identifiers}`).then((resp:any) => {
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
    deleteSingle(val: { identifier: any }) {
      ElMessageBox.confirm(
        '确定要删除此记录吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/comment/deleteComment?identifier=${val.identifier}`).then((resp:any) => {
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
    viewSingle(val:any) {
      this.showEditDialog = false
      api.get(`server/comment/initViewReqBody?identifier=${val.identifier}`).then((resp:any) => {
        this.editDetail = resp.data

        this.dialogTitle = '评审意见详情'
        this.dialogType = 'VIEW'
        this.showEditDialog = true

        this.languageType = (this.editDetail as any).codeType

      }).catch((reason) => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${reason}`,
        })
      })
    },
    editSingle(val:any) {
      this.showEditDialog = false
      api.get(`server/comment/initEditReqBody?identifier=${val.identifier}`).then((resp:any) => {
        this.editDetail = resp.data
        this.dialogTitle = '修改评审意见'
        this.dialogType = 'EDIT'
        this.showEditDialog = true
      }).catch((reason) => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${reason.message}`,
        })
      })
    },
    saveOperation() {
      (this.$refs.editDetailForm as any).validate((valid:any) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          let reqUrl
          if (this.dialogType === 'CREATE') {
            reqUrl = 'server/comment/createComment'
          }
          else if (this.dialogType === 'EDIT') {
            reqUrl = 'server/comment/modifyComment'
          }
          else if (this.dialogType === 'CONFIRM') {
            reqUrl = 'server/comment/confirmComment'
          }
          else {
            ElMessage({
              type: 'error',
              message: '请求操作类型不合法',
            })
            return
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
      this.showEditDialog = false
      api.get('server/comment/initCreateReqBody').then((resp) => {
        this.editDetail = resp.data
        this.dialogTitle = '添加评审意见'
        this.dialogType = 'CREATE'
        this.showEditDialog = true
      }).catch((reason) => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${reason}`,
        })
      })
    },

    cancelCreateOperation() {
      this.showEditDialog = false
    },
    confirmSingle(val:any) {
      this.showEditDialog = false
      api.get(`server/comment/initConfirmReqBody?identifier=${val.identifier}`).then((resp) => {
        this.editDetail = resp.data
        this.dialogTitle = '评审意见确认'
        this.dialogType = 'CONFIRM'
        this.showEditDialog = true
      }).catch((reason) => {
        ElMessage({
          type: 'error',
          message: `编辑失败：${reason}`,
        })
      })
    },
  },

}
</script>

<template>
  <div>
    <page-header title="我提交的" content="本页面展示所有您提交的检视意见，您可以在此页面查看、编辑、删除已提交的内容，或者新建并提交新的检视意见。" />

    <page-main title="搜索条件">
      <search-bar>
        <el-form :model="search" size="default" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="指派确认人员">
                <el-select v-model.trim="(search.queryParams as any).assignConfirmUser" placeholder="请输入姓名或账号查询" clearable filterable>
                  <el-option
                    v-for="(item, index) in listUsers"
                    :key="(item as any).account"
                    :label="(item as any).name"
                    :value="(item as any).account"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实际确认人员">
                <el-select v-model.trim="(search.queryParams as any).realConfirmUser" placeholder="请输入姓名或账号查询" clearable filterable>
                  <el-option
                    v-for="(item, index) in listUsers"
                    :key="(item as any).account"
                    :label="(item as any).name"
                    :value="(item as any).account"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="确认结果">
                <el-select v-model.trim="(search.queryParams as any).confirmResult" placeholder="输入评审意见的确认状态" clearable>
                  <el-option
                    v-for="(item, index) in confirmResultItems"
                    :key="(item as any).value"
                    :label="(item as any).showName"
                    :value="(item as any).value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="唯一ID">
                <el-input v-model="(search.queryParams as any).identifier" placeholder="输入评审意见唯一ID进行查询" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="归属部门">
                <el-tree-select clearable
                  v-model="(search.queryParams as any).departmentId"
                  :data="departmentTree" :render-after-expand="false" check-strictly="true"
                  @change="loadProjects"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="归属项目">
                <el-select v-model.trim="(search.queryParams as any).projectId" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="(item, index) in listProjects"
                    :key="(item as any).id"
                    :label="(item as any).projectName"
                    :value="(item as any).id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="clickSearch">
              <template #icon>
                <el-icon>
                  <svg-icon name="ep:search" />
                </el-icon>
              </template>
              查询
            </el-button>
            <el-button @click="resetSearch">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </search-bar>
    </page-main>

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
        <el-button type="default" @click="exportData">
          <template #icon>
            <el-icon>
              <svg-icon name="ep:download" />
            </el-icon>
          </template>
          数据导出
        </el-button>
      </div>

      <el-table border highlight-current-row :data="commentsData.list" height="100%" @selection-change="getSelectedRows">
        <el-table-column type="selection" width="55" />
        <template v-for="(col, idx) in columnFields">
          <el-table-column
            v-if="(col as any).showInWebTable"
            :key="(col as any).columnCode"
            :prop="(col as any).columnCode"
            :label="(col as any).showName"
            :width="(col as any).webTableColumnWidth"
            :index="idx"
          />
        </template>

        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="viewSingle(scope.row)">
              查看
            </el-button>
            <el-button link type="primary" size="small" @click="editSingle(scope.row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="deleteSingle(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageination-style"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="commentsData.pageSize"
        :total="commentsData.total"
        :current-page="commentsData.currPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </page-main>

    <el-dialog v-model="showEditDialog" :title="dialogTitle">
      <el-form ref="editDetailForm" :model="editDetail" size="default" label-width="120px" :rules="editFieldRules">
        <template v-for="(column, idx) in (editDetail as any).fieldModelList">
          <div v-if="column.show">
            <el-form-item v-if="column.inputType == 'TEXT'" :label="column.showName">
              <el-input v-model="(editDetail as any).fieldModelList[idx].valuePair.value" :disabled="column.editable === false" />
            </el-form-item>
            <el-form-item v-if="column.inputType == 'COMBO_BOX'" :label="column.showName">
              <el-select v-model="(editDetail as any).fieldModelList[idx].valuePair" :disabled="column.editable === false" filterable>
                <template v-for="item in column.enumValues">
                  <el-option :label="item.showName" :value="item" />
                </template>
              </el-select>
            </el-form-item>
            <el-form-item v-if="column.inputType == 'DATE'" :label="column.showName">
              <el-date-picker :disabled="column.editable === false"
                  v-model="(editDetail as any).fieldModelList[idx].valuePair.value"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="点击选择日期"
              />
            </el-form-item>
            <el-form-item v-if="column.inputType == 'TEXTAREA' && column.code == 'content' && column.editable === false" :label="column.showName">
                <div style="width: 100%;line-height: 30px;padding: 5px;">
                  <highlightjs :language="languageType" :code="(editDetail as any).fieldModelList[idx].valuePair.value"></highlightjs>
                </div>
            </el-form-item>
            <el-form-item v-if="column.inputType == 'TEXTAREA' && column.code == 'content' && column.editable === true" :label="column.showName">
              <el-input
                v-model="(editDetail as any).fieldModelList[idx].valuePair.value" :rows="5" :disabled="column.editable === false"
                type="textarea"
              />
            </el-form-item>
            <el-form-item v-if="column.inputType == 'TEXTAREA' && column.code != 'content'" :label="column.showName">
              <el-input
                v-model="(editDetail as any).fieldModelList[idx].valuePair.value" :rows="5" :disabled="column.editable === false"
                type="textarea"
              />
            </el-form-item>
          </div>
        </template>
      </el-form>
      <template v-if="dialogType !== 'VIEW'" #footer>
        <span class="dialog-footer">
          <el-button @click="cancelEditOperation">
            取消
          </el-button>
          <el-button type="primary" @click="saveOperation">
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
