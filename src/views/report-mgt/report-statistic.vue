<route lang="yaml">
meta:
  enabled: false
</route>

<script lang="ts">
import api from "@/api";
import { defineComponent, onMounted, ref } from "vue";
import useUserStore from "@/store/modules/user";
import * as echarts from "echarts";

const userStore = useUserStore();

const confirmResultRef = ref();
const projectRef = ref();
const reviewerRef = ref();
const realConfirmerRef = ref();

export default {
  data() {
    return {
      search: {},
      statData: {},
      departmentTree: {},
      listProjects: [],
      listUsers: [],
      confirmResultItems: [],
    };
  },
  computed: {},
  mounted() {
    this.loadUserList();
    this.loadProjects();
    this.loadConfirmResultItems();
    this.loadDepartmentTree();
    this.clickSearch();
  },
  methods: {
    clickSearch() {
      api.post("/server/stat/query", this.search).then((res) => {
        this.statData = res.data;

        this.initChart(this.$refs.confirmResultRef as any, (this.statData as any).confirmResultChartModel);
        this.initChart(this.$refs.projectRef as any, (this.statData as any).projectChartModel);
        this.initChart(this.$refs.reviewerRef as any, (this.statData as any).reviewerChartModel);
        this.initChart(this.$refs.realConfirmerRef as any, (this.statData as any).realConfirmerChartModel);
      });
    },
    resetSearch() {
      this.search = {
        projectId: null,
        departmentId: null,
        commitUser: userStore.account,
        realConfirmUser: null,
        assignConfirmUser: null,
        confirmResult: null,
      };
      this.clickSearch();
    },
    loadUserList() {
      api.get("server/user/getAllUserDetails").then((res) => {
        this.listUsers = res.data;
      });
    },

    loadProjects() {
      api
        .get(
          `server/project/queryProjectInDept?deptId=${(this.search as any).departmentId}`
        )
        .then((res) => {
          this.listProjects = res.data;
        });
    },

    loadConfirmResultItems() {
      api.get("server/column/queryConfirmResultDictItems").then((res) => {
        this.confirmResultItems = res.data;
      });
    },

    loadDepartmentTree() {
      api.get("server/dept/getDeptTree").then((res) => {
        this.departmentTree = res.data;
      });
    },

    initChart(charRef, charDataModel) {
      let chart = echarts.init(charRef);

      // 配置数据
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: charDataModel.xaxisData,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            type: "bar",
            data: charDataModel.seriesData,
          },
        ],
      };
      // 传入数据
      chart.setOption(option);
    },
  },
};
</script>

<template>
  <div>
    <page-header
      title="数据统计"
      content="本页面提供数据统计分析能力，支持对符合指定条件的数据进行统计"
    />

    <page-main title="过滤条件">
      <search-bar>
        <el-form :model="search" size="default" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="检视人员">
                <el-select
                  v-model.trim="(search as any).commitUser"
                  placeholder="请输入姓名或账号查询"
                  clearable
                  filterable
                >
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
              <el-form-item label="指派确认人员">
                <el-select
                  v-model.trim="(search as any).assignConfirmUser"
                  placeholder="请输入姓名或账号查询"
                  clearable
                  filterable
                >
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
                <el-select
                  v-model.trim="(search as any).realConfirmUser"
                  placeholder="请输入姓名或账号查询"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in listUsers"
                    :key="(item as any).account"
                    :label="(item as any).name"
                    :value="(item as any).account"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="确认结果">
                <el-select
                  v-model.trim="(search as any).confirmResult"
                  placeholder="输入评审意见的确认状态"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in confirmResultItems"
                    :key="(item as any).value"
                    :label="(item as any).showName"
                    :value="(item as any).value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="归属部门">
                <el-tree-select
                  clearable
                  v-model="(search as any).departmentId"
                  :data="departmentTree"
                  :render-after-expand="false"
                  check-strictly="true"
                  @change="loadProjects"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="归属项目">
                <el-select
                  v-model.trim="(search as any).projectId"
                  placeholder="请选择"
                  clearable
                  filterable
                >
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
            <el-button @click="resetSearch"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </search-bar>
    </page-main>

    <ElRow :gutter="20" style="margin: -10px 10px">
      <ElCol :md="12">
        <PageMain title="评审意见确认结果统计" style="margin: 10px 0">
          <div ref="confirmResultRef" style="width: 100%; height: 400px" />
        </PageMain>
      </ElCol>
      <ElCol :md="12">
        <PageMain title="项目维度分布统计" style="margin: 10px 0">
          <div ref="projectRef" style="width: 100%; height: 400px" />
        </PageMain>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20" style="margin: -10px 10px">
      <ElCol :md="12">
        <PageMain title="检视人员提交记录统计" style="margin: 10px 0">
          <div ref="reviewerRef" style="width: 100%; height: 400px" />
        </PageMain>
      </ElCol>
      <ElCol :md="12">
        <PageMain title="实际确认人员提交记录统计" style="margin: 10px 0">
          <div ref="realConfirmerRef" style="width: 100%; height: 400px" />
        </PageMain>
      </ElCol>
    </ElRow>
  </div>
</template>
