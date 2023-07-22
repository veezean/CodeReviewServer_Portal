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
        pageSize: 20,
        pageIndex: 1,
        queryParams: {
          deptId: null,
          phoneNumber: null,
          account: null,
          name: null,
        },
      },
      queryUserRespData: {
        list: [],
        currPage: 1,
        pageSize: 20,
        total: 0,
        totalPage: 0,
      },
      departmentTree: {

      },
      roleList: [],
      selectedRoles: [],
      selectedRows: [],
      editUserDetail: { },
      createUserDetail: {},
      editFieldRules: {
        name: [{ required: true, message: '用户姓名必填', trigger: 'blur' }],
        account: [{ required: true, message: '用户账号必填', trigger: 'blur' }],
      },
    }
  },
  computed: {

  },
  mounted() {
    this.clickSearch()
    this.loadDepartmentTree()
    this.loadRoles()
  },
  methods: {
    loadRoles() {
      api.get('server/role/getRoles').then((res) => {
        this.roleList = res.data
      })
    },
    loadDepartmentTree() {
      api.get('server/dept/getDeptTree').then((res) => {
        this.departmentTree = res.data
      })
    },
    clickSearch() {
      api.post('server/user/getUserDetails', this.search).then((res) => {
        this.queryUserRespData = res.data
      })
    },
    resetSearch() {
      this.search.queryParams = {
        deptId: null,
        phoneNumber: null,
        account: null,
        name: null,
      }
      this.clickSearch()
    },
    handleClick() {
      // eslint-disable-next-line no-console
      console.log('click')
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
    deleteSelection(val:any) {
      ElMessageBox.confirm(
        '确定要删除所选用户吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          const accounts = []
          for (let index = 0; index < this.selectedRows.length; index++) {
            const element:any = this.selectedRows[index]
            accounts.push(element.account)
          }
          api.get(`server/user/deleteUsers?accounts=${accounts}`).then((resp: any) => {
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
    deleteSingle(val: { account: any }) {
      ElMessageBox.confirm(
        '确定要删除此用户吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/user/deleteUser?account=${val.account}`).then((resp: any) => {
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
      api.get(`server/user/getUserDetail?account=${val.account}`).then((resp: any) => {
        this.editUserDetail = resp.data
        this.selectedRoles = []
        for (let index = 0; index < (this.editUserDetail as any).roles.length; index++) {
          (this.selectedRoles as any).push((this.editUserDetail as any).roles[index].id)
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
      (this.$refs.editUserDetailForm as any).validate((valid: any) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post('server/user/modifyUser', {
            account: (this.editUserDetail as any).account,
            name: (this.editUserDetail as any).name,
            departmentId: (this.editUserDetail as any).department.id,
            phoneNumber: (this.editUserDetail as any).phoneNumber,
            roles: this.selectedRoles,
          }).then((resp: any) => {
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
    createUser() {
      this.createUserDetail = {
        account: '',
        name: '',
        password: '',
        phoneNumber: '',
      }
      this.selectedRoles = []
      this.showCreateDialog = true
    },
    cancelCreateOperation() {
      this.showCreateDialog = false
    },
    saveCreateOperation() {
      (this.$refs.createUserDetailForm as any).validate((valid: any) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          (this.createUserDetail as any).roles = this.selectedRoles
          api.post('server/user/createUser', this.createUserDetail).then((resp: any) => {
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
    <page-header title="用户管理" content="本页面提供对系统内用户数据的整体维护管理能力，可以新增用户或者删除用户操作，或者对已有用户信息进行变更。" />

    <page-main title="搜索条件">
      <search-bar>
        <el-form :model="search" size="default" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名">
                <el-input v-model="search.queryParams.name" placeholder="输入用户姓名查询" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账号">
                <el-input v-model="search.queryParams.account" placeholder="输入用户账号查询" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input v-model="search.queryParams.phoneNumber" placeholder="手机号查询" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="部门">
                <el-tree-select
                  v-model="search.queryParams.deptId" :data="departmentTree" :render-after-expand="false"
                  check-strictly="true"
                />
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
        <el-button type="primary" @click="createUser">
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

      <el-table border highlight-current-row :data="queryUserRespData.list" height="100%" @selection-change="getSelectedRows">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="name" label="姓名" width="150" />
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="phoneNumber" label="手机号" width="120" />
        <el-table-column prop="department.name" label="部门" width="120" />
        <el-table-column prop="roles" label="角色">
          <template #default="scope">
            <span v-for="(role, index) in scope.row.roles" :key="role.id">

              <el-tag class="tag-style">
                {{ role.roleName }}
              </el-tag>
            </span>
          </template>
        </el-table-column>
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
      <el-pagination
        class="pageination-style"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="queryUserRespData.pageSize"
        :total="queryUserRespData.total"
        :current-page="queryUserRespData.currPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </page-main>

    <el-dialog v-model="showEditDialog" title="编辑用户信息">
      <el-form ref="editUserDetailForm" :model="editUserDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="18">
          <el-form-item label="账号">
            <el-input v-model="(editUserDetail as any).account" placeholder="用户账号" readonly disabled />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="姓名" prop="name" :rules="editFieldRules.name">
            <el-input v-model="(editUserDetail as any).name" placeholder="用户姓名" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="手机号">
            <el-input v-model="(editUserDetail as any).phoneNumber" placeholder="手机号" clearable maxlength="32" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="部门">
            <el-tree-select
              v-model="(editUserDetail as any).department.id" :data="departmentTree" :render-after-expand="false"
              check-strictly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色">
            <el-select
              v-model="selectedRoles"
              multiple
              placeholder="Select"
              style="width: 440px"
            >
              <el-option
                v-for="item in roleList"
                :key="(item as any).id"
                :label="(item as any).roleName"
                :value="(item as any).id"
              />
            </el-select>
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

    <el-dialog v-model="showCreateDialog" title="新建用户">
      <el-form ref="createUserDetailForm" :model="createUserDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="18">
          <el-form-item label="账号" prop="account" :rules="editFieldRules.account">
            <el-input v-model="(createUserDetail as any).account" placeholder="输入用户账号" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="姓名" prop="name" :rules="editFieldRules.name">
            <el-input v-model="(createUserDetail as any).name" placeholder="输入用户姓名" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="手机号">
            <el-input v-model="(createUserDetail as any).phoneNumber" placeholder="手机号" clearable maxlength="32" show-word-limit />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="部门">
            <el-tree-select
              v-model="(createUserDetail as any).departmentId" :data="departmentTree" :render-after-expand="false"
              check-strictly="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色">
            <el-select
              v-model="selectedRoles"
              multiple
              placeholder="Select"
              style="width: 440px"
            >
              <el-option
                v-for="item in roleList"
                :key="(item as any).id"
                :label="(item as any).roleName"
                :value="(item as any).id"
              />
            </el-select>
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
