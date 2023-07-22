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
      showCreateDialog: false,
      batchBtnEnable: false,
      search: {
        queryParams: {
          deptId: null,
        },
      },
      departmentTree: {

      },
      projectList: [],
      selectedRows: [],
      editDetail: { },
      createDetail: {},
      editFieldRules: {
        projectName: [{ required: true, message: '项目名称必填', trigger: 'blur' }],
      },
    }
  },
  computed: {

  },
  mounted() {
    this.clickSearch()
    this.loadDepartmentTree()
  },
  methods: {
    loadProjects() {
      const queryDeptId = this.search.queryParams.deptId ? this.search.queryParams.deptId : 0
      api.get(`server/project/queryProjectInDept?deptId=${queryDeptId}`).then((res) => {
        this.projectList = res.data
      })
    },
    loadDepartmentTree() {
      api.get('server/dept/getDeptTree').then((res) => {
        this.departmentTree = res.data
      })
    },
    clickSearch() {
      this.loadProjects()
    },
    resetSearch() {
      this.search.queryParams = {
        deptId: null,
      }
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
    deleteSelection(val:any) {
      ElMessageBox.confirm(
        '确定要删除所选项目吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          const projectIds = []
          for (let index = 0; index < this.selectedRows.length; index++) {
            const element = this.selectedRows[index]
            projectIds.push((element as any).id)
          }
          api.get(`server/project/deleteProjects?projectIds=${projectIds}`).then((resp:any) => {
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
        '确定要删除此项目吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/project/deleteProject?projectId=${val.id}`).then((resp:any) => {
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
      api.get(`server/project/queryProject?projectId=${val.id}`).then((resp:any) => {
        this.editDetail = {
          projectName: resp.data.projectName,
          projectDesc: resp.data.projectDesc,
          departmentId: resp.data.department.id,
          id: resp.data.id,
        }
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
          api.post(`server/project/modifyProject?projId=${(this.editDetail as any).id}`, this.editDetail).then((resp:any) => {
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
      this.createDetail = {
        projectName: '',
        projectDesc: '',
      }
      this.showCreateDialog = true
    },
    cancelCreateOperation() {
      this.showCreateDialog = false
    },
    saveCreateOperation() {
      (this.$refs.createDetailForm as any).validate((valid:any) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post('server/project/createProject', this.createDetail).then((resp:any) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              this.showCreateDialog = false
              this.clickSearch()
            }
            else {
              ElMessage({
                type: 'error',
                message: `保存失败：${resp.message}`,
              })
            }
          })
        }
      })
    },

  },

}
</script>

<template>
  <div>
    <page-header title="项目管理" content="本页面提供对系统内所有的项目信息进行维护，项目需要绑定到部门，支持按照部门维度筛选自己部门内的项目列表。" />

    <page-main title="搜索条件">
      <search-bar>
        <el-form :model="search" size="default" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="归属部门">
                <el-tree-select
                  v-model="search.queryParams.deptId" :data="departmentTree" :render-after-expand="false"
                  check-strictly="true"
                />
              </el-form-item>
            </el-col>

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
          </el-row>
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
      </div>

      <el-table border highlight-current-row :data="projectList" height="100%" @selection-change="getSelectedRows">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="id" label="项目ID" width="100" />
        <el-table-column prop="projectName" label="项目名称" width="360" />
        <el-table-column prop="department.name" label="归属部门" width="200" />
        <el-table-column prop="projectDesc" label="项目描述" />
        <el-table-column fixed="right" label="操作" width="200">
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

    <el-dialog v-model="showEditDialog" title="编辑项目信息">
      <el-form ref="editDetailForm" :model="editDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="18">
          <el-form-item label="项目ID">
            <el-input v-model="(editDetail as any).id" readonly disabled />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="项目名称" prop="projectName" :rules="editFieldRules.projectName">
            <el-input v-model="(editDetail as any).projectName" placeholder="输入项目的名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="归属部门">
            <el-tree-select
              v-model="(editDetail as any).departmentId" :data="departmentTree" :render-after-expand="false"
              check-strictly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="项目描述">
            <el-input v-model="(editDetail as any).projectDesc" type="textarea" :rows="3" placeholder="输入项目的简要描述信息" clearable maxlength="32" show-word-limit />
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

    <el-dialog v-model="showCreateDialog" title="创建项目信息">
      <el-form ref="createDetailForm" :model="createDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="18">
          <el-form-item label="项目名称" prop="projectName" :rules="editFieldRules.projectName">
            <el-input v-model="(createDetail as any).projectName" placeholder="输入项目的名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="归属部门">
            <el-tree-select
              v-model="(createDetail as any).departmentId" :data="departmentTree" :render-after-expand="false"
              check-strictly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="项目描述">
            <el-input v-model="(createDetail as any).projectDesc" type="textarea" :rows="3" placeholder="输入项目的简要描述信息" clearable maxlength="32" show-word-limit />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelCreateOperation">
            取消
          </el-button>
          <el-button type="primary" @click="saveCreateOperation">
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
