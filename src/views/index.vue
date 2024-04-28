<route lang="yaml">
name: home
meta:
  title: 主页
</route>

<script lang="ts">
import { ArrowRight, CaretBottom, CaretTop, Warning } from "@element-plus/icons-vue";

import api from "@/api";
import { defineComponent, onMounted, ref } from "vue";
import * as echarts from "echarts";


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
      countData:{},
    };
  },
  computed: {},
  mounted() {
    this.clickSearch();
  },
  methods: {
    clickSearch() {
      api.get("/server/stat/homestat").then((res) => {
        this.countData = res.data;
      });

      api.post("/server/stat/query", this.search).then((res) => {
        this.statData = res.data;

        this.initChart(this.$refs.confirmResultRef as any, (this.statData as any).confirmResultChartModel);
        this.initChart(this.$refs.projectRef as any, (this.statData as any).projectChartModel);
        this.initChart(this.$refs.reviewerRef as any, (this.statData as any).reviewerChartModel);
        this.initChart(this.$refs.realConfirmerRef as any, (this.statData as any).realConfirmerChartModel);
      });
    },

    initChart(charRef:any, charDataModel:any) {
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
    <page-header title="欢迎使用CodeReview管理系统">
      <template #content>
        <div></div>
      </template>
    </page-header>
    <el-row>
      <el-col :span="12">
        <page-main title="我的数据">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="(countData as any).waitingMeConfirm" suffix="条">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      待我确认
                      <el-tooltip
                        effect="dark"
                        content="等待您确认处理的评审意见数"
                        placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="16">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="(countData as any).myCommitted" suffix="条">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      我提交的
                      <el-tooltip
                        effect="dark"
                        content="统计由您提交的评审意见总条数"
                        placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="16">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="(countData as any).myConfirmed" suffix="条">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      我确认的
                      <el-tooltip
                        effect="dark"
                        content="统计由您执行确认操作的评审意见总条数"
                        placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="16">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </page-main>
      </el-col>
      <el-col :span="12">
        <page-main title="系统数据">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="(countData as any).allComments" suffix="条">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      全部意见
                      <el-tooltip
                        effect="dark"
                        content="系统已有的全部评审意见数"
                        placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="16">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="(countData as any).waitingConfirm" suffix="条">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      等待确认
                      <el-tooltip
                        effect="dark"
                        content="系统内当前全部待确认评审意见数"
                        placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="16">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="(countData as any).totalProjects" suffix="个">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      项目总数
                      <el-tooltip
                        effect="dark"
                        content="统计当前系统内的所有项目个数"
                        placement="top"
                      >
                        <el-icon style="margin-left: 4px" :size="16">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
              </div>
            </el-col>
          </el-row>
        </page-main>
      </el-col>
    </el-row>

    <page-main>
      <ElRow :gutter="20" style="margin: -10px 10px">
        <ElCol :md="6">
          <PageMain title="评审意见确认结果统计" style="margin: 10px 0">
            <div ref="confirmResultRef" style="width: 100%; height: 320px" />
          </PageMain>
        </ElCol>
        <ElCol :md="6">
          <PageMain title="项目维度分布统计" style="margin: 10px 0">
            <div ref="projectRef" style="width: 100%; height: 320px" />
          </PageMain>
        </ElCol>
        <ElCol :md="6">
          <PageMain title="检视人员提交记录统计" style="margin: 10px 0">
            <div ref="reviewerRef" style="width: 100%; height: 320px" />
          </PageMain>
        </ElCol>
        <ElCol :md="6">
          <PageMain title="实际确认人员提交记录统计" style="margin: 10px 0">
            <div ref="realConfirmerRef" style="width: 100%; height: 320px" />
          </PageMain>
        </ElCol>
      </ElRow>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: #d0e2ff;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
