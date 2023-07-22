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
          roleCode: [{ required: true, message: '角色编码必填', trigger: 'blur' }],
          roleName: [{ required: true, message: '角色名称必填', trigger: 'blur' }],
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
        api.get('server/role/getRoles').then((res) => {
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
          '确定要删除所选角色吗？此操作不可恢复！',
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
            api.get(`server/role/deleteRoles?roleIds=${ids}`).then((resp:any) => {
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
          '确定要删除此角色吗？此操作不可恢复！',
          'Warning',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
          .then(() => {
            api.get(`server/role/deleteRole?roleId=${val.id}`).then((resp:any) => {
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
        api.get(`server/role/getRoleById?roleId=${val.id}`).then((resp:any) => {
          this.editDetail = {
            roleCode: resp.data.roleCode,
            roleName: resp.data.roleName,
            roleDesc: resp.data.roleDesc,
            canAccessPage: resp.data.canAccessPage,
            id: resp.data.id,
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
            let reqUrl = `server/role/modifyRole?roleId=${(this.editDetail as any).id}`
            if (this.dialogType === 'CREATE') {
              reqUrl = 'server/role/addRole'
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
          roleCode: '',
          roleName: '',
          roleDesc: '',
          canAccessPage: '',
        }
        this.dialogType = 'CREATE'
        this.showEditDialog = true
      },
      cancelCreateOperation() {
        this.showEditDialog = false
      },
    },

  }
  </script>

  <template>
    <div>
      <page-header title="角色管理" content="本页面提供对用户角色的维护能力。" />

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
          <el-table-column fixed prop="id" label="ID" width="100" />
          <el-table-column fixed prop="roleCode" label="角色编码" width="140" />
          <el-table-column fixed prop="roleName" label="角色名称" width="140" />
          <el-table-column fixed prop="canAccessPage" label="可访问界面" width="400" />
          <el-table-column prop="roleDesc" label="描述说明" />
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

      <el-dialog v-model="showEditDialog" :title="dialogType === 'CREATE' ? '创建角色' : '编辑角色' ">
        <el-form ref="editDetailForm" :model="editDetail" size="default" label-width="120px" :rules="editFieldRules">
          <el-col :span="18">
            <el-form-item label="角色编码" prop="roleCode" :rules="editFieldRules.roleCode">
              <el-input v-model="(editDetail as any).roleCode" placeholder="输入角色编码" maxlength="64" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="角色名称" prop="roleName" :rules="editFieldRules.roleName">
              <el-input v-model="(editDetail as any).roleName" placeholder="输入角色名称" maxlength="64" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="可访问界面" prop="canAccessPage">
              <el-input v-model="(editDetail as any).canAccessPage" placeholder="输入可访问界面，多个之间逗号分隔，输入ALL表示允许访问全部界面" maxlength="255" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="角色描述">
              <el-input v-model="(editDetail as any).roleDesc" type="textarea" :rows="3" placeholder="输入简要描述信息" clearable maxlength="256" show-word-limit />
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
