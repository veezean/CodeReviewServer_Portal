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
      dataSource: {

      },
      editDeptDetail: {

      },
      createDeptDetail: {

      },
      editFieldRules: {
        name: [{ required: true, message: '部门名称必填', trigger: 'blur' }],
      },
    }
  },
  computed: {

  },
  mounted() {
    this.loadDepartmentTree()
  },
  methods: {
    loadDepartmentTree() {
      api.get('server/dept/getDeptTree').then((res) => {
        this.dataSource = res.data
      })
    },

    edit(node, data) {
      this.editDeptDetail = {
        deptId: node.key,
        parentId: node.data.parentId,
        name: node.label,
      }
      this.showEditDialog = true
    },

    cancelEditOperation() {
      this.showEditDialog = false
    },

    saveEdit() {
      this.$refs.editDeptDetailForm.validate((valid) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post(`server/dept/modifyDept?deptId=${this.editDeptDetail.deptId}`, this.editDeptDetail).then((resp) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              this.showEditDialog = false
              this.loadDepartmentTree()
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

    create() {
      this.createDeptDetail = {}
      this.showCreateDialog = true
    },

    cancelCreateOperation() {
      this.showCreateDialog = false
    },

    saveCreateOperation() {
      this.$refs.createDeptDetailForm.validate((valid) => {
        if (!valid) {
          ElMessage({
            type: 'error',
            message: '参数内容填写有误，请检查',
          })
        }
        else {
          api.post('server/dept/createDept', this.createDeptDetail).then((resp) => {
            if (resp.code === 0) {
              ElMessage({
                type: 'success',
                message: '保存成功',
              })
              this.showCreateDialog = false
              this.loadDepartmentTree()
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

    remove(node, data) {
      if (!node.isLeaf) {
        ElMessage({
          type: 'error',
          message: '存在子节点，不允许删除',
        })
        return
      }
      ElMessageBox.confirm(
        '确定要删除所选部门吗？此操作不可恢复！',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          api.get(`server/dept/deleteDept?deptId=${node.key}`).then((resp) => {
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
            this.loadDepartmentTree()
          })
        })
        .catch(() => {

        })
    },

  },

}
</script>

<template>
  <div>
    <page-header title="部门管理" content="本页面提供对系统内所有的部门信息进行维护的能力，部门在系统内是一个重要基础数据，人员、项目都需要隶属于某个部门下。" />

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
      </div>

      <el-tree
        :data="dataSource"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <a @click="edit(node, data)"> 编辑 </a>
              <a style="margin-left: 8px" @click="remove(node, data)"> 删除 </a>
            </span>
          </span>
        </template>
      </el-tree>
    </page-main>

    <el-dialog v-model="showCreateDialog" title="新建部门">
      <el-form ref="createDeptDetailForm" :model="createDeptDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="24">
          <el-form-item label="父部门">
            <el-tree-select
              v-model="createDeptDetail.parentId" :data="dataSource" :render-after-expand="false"
              check-strictly="true"
            />
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="部门名称" prop="name" :rules="editFieldRules.name">
            <el-input v-model="createDeptDetail.name" placeholder="输入部门名称" maxlength="64" show-word-limit />
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

    <el-dialog v-model="showEditDialog" title="编辑部门">
      <el-form ref="editDeptDetailForm" :model="editDeptDetail" size="default" label-width="120px" :rules="editFieldRules">
        <el-col :span="24">
          <el-form-item label="父部门">
            <el-tree-select
              v-model="editDeptDetail.parentId" :data="dataSource" :render-after-expand="false"
              check-strictly="true"
            />
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="部门名称" prop="name" :rules="editFieldRules.name">
            <el-input v-model="editDeptDetail.name" placeholder="输入部门名称" maxlength="64" show-word-limit />
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelEditOperation">
            取消
          </el-button>
          <el-button type="primary" @click="saveEdit">
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

  .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
  </style>
