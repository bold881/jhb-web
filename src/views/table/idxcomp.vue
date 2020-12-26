<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="carIdxSelected" default-first-option placeholder="指标选择" size="medium" @change="onIdxChange">
        <el-option v-for="item in options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="extreTypeSelected" default-first-option placeholder="极值类型" size="medium" class="margin-btn" @change="onExtremChange">
        <el-option v-for="item in extremumType" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="margin-btn" type="primary" size="small" @click="doCalc()">执行</el-button>
    </el-row>
    <el-row class="row-idx">
      <el-select v-model="carServiceSelected" default-first-option placeholder="计算车型选择" size="medium" @change="onCmpServiceChange">
        <el-option v-for="item in carServiceList" :key="item.carServiceName" :label="item.carServiceName" :value="item.carServiceName" />
      </el-select>
    </el-row>
    <el-divider />
    <el-table border v-loading="listLoading" :data="idxList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="竞品名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.carServiceName }}
        </template>
      </el-table-column>
      <el-table-column label="车型值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carIdxValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider />
    <p>策略L：</p>
    <el-row>
      <el-col :span="12">
        <el-table border :data="lresult">
          <el-table-column prop="idxName" label="性能指标" width="180" />
          <el-table-column prop="strategy" label="策略" width="180" />
          <el-table-column prop="band" label="带宽" />
          <el-table-column prop="recommend" label="推荐目标" />
          <el-table-column prop="devTarget" label="开发车目标" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="lchart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <p>策略A：</p>
    <el-row>
      <el-col :span="12">
        <el-table border :data="aresult">
          <el-table-column prop="idxName" label="性能指标" width="180" />
          <el-table-column prop="strategy" label="策略" width="180" />
          <el-table-column prop="band" label="带宽" />
          <el-table-column prop="recommend" label="推荐目标" />
          <el-table-column prop="devTarget" label="开发车目标" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="achart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <p>策略C：</p>
    <el-row>
      <el-col :span="12">
        <el-table border :data="cresult">
          <el-table-column prop="idxName" label="性能指标" width="180" />
          <el-table-column prop="strategy" label="策略" width="180" />
          <el-table-column prop="band" label="带宽" />
          <el-table-column prop="recommend" label="推荐目标" />
          <el-table-column prop="devTarget" label="开发车目标" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="cchart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <p>策略U：</p>
    <el-row>
      <el-col :span="12">
        <el-table border :data="uresult">
          <el-table-column prop="idxName" label="性能指标" width="180" />
          <el-table-column prop="strategy" label="策略" width="180" />
          <el-table-column prop="band" label="带宽" />
          <el-table-column prop="recommend" label="推荐目标" />
          <el-table-column prop="devTarget" label="开发车目标" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="uchart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUniqueIdxNames,
  getPerformanceByIdx,
  nullWarning } from '@/api/table'
import { std } from 'mathjs'

import norminv from 'norminv'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      addIdxDlgVisible: false,
      idxList: null,
      listLoading: false,
      options: [],
      carIdxSelected: '',
      carServiceList: [],
      carServiceSelected: null,
      addIdxDlgData: {
        carIdxName: '',
        carServiceName: '',
        carIdxValue: ''
      },
      extremumType: [
        {
          'label': '极小型',
          'value': 0
        },
        {
          'label': '极大型',
          'value': 1
        }
      ],
      extreTypeSelected: null,
      // L策略结果
      lresult: [],
      // A策略结果
      aresult: [],
      // C策略结果
      cresult: [],
      // U策略结果
      uresult: []
    }
  },
  created() {
    this.fetchCarIdxNames()
  },
  methods: {
    // 指标添加按钮点击
    onAddIdxBtnClick() {
      this.addIdxDlgVisible = true
      this.addIdxDlgData.carIdxName = this.carIdxSelected
    },

    // 指标添加窗口关闭之前
    doCalc() {
      // 获取极值类型
      console.log(this.extreTypeSelected)
      if (!nullWarning(this, this.extreTypeSelected, '请选择极值类型')) {
        return
      }

      if (!nullWarning(this, this.idxList, '竞品车型不能为空')) {
        return
      }

      // 计算算数平均值
      let total = 0
      const values = []
      this.idxList.forEach(e => {
        total += e.carIdxValue
        values.push(e.carIdxValue)
      })
      const avgValue = total / this.idxList.length
      console.log('平均数:' + avgValue)

      // 计算标准差
      const stdValue = std(values)
      console.log('标准差:' + stdValue)

      // 指定平均值和标准偏差的正态累积分布函数的反函数
      let lvalue = this.norminvCalc(avgValue, stdValue, this.extreTypeSelected, 0.1)
      let avalue = this.norminvCalc(avgValue, stdValue, this.extreTypeSelected, 0.3)
      let cvalue = this.norminvCalc(avgValue, stdValue, this.extreTypeSelected, 0.7)

      lvalue = parseFloat(lvalue.toFixed(2))
      avalue = parseFloat(avalue.toFixed(2))
      cvalue = parseFloat(cvalue.toFixed(2))
      const lamid = ((lvalue + avalue) / 2).toFixed(2)
      const acmid = ((avalue + cvalue) / 2).toFixed(2)

      this.lresult.push({
        'idxName': this.carIdxSelected,
        'strategy': 'L',
        'band': '≤ ' + lvalue,
        'recommend': lvalue,
        'devTarget': null
      })
      this.aresult.push({
        'idxName': this.carIdxSelected,
        'strategy': 'A',
        'band': lvalue + ' ~ ' + avalue,
        'recommend': lamid,
        'devTarget': null
      })
      this.cresult.push({
        'idxName': this.carIdxSelected,
        'strategy': 'C',
        'band': avalue + ' ~ ' + cvalue,
        'recommend': acmid,
        'devTarget': null
      })
      this.uresult.push({
        'idxName': this.carIdxSelected,
        'strategy': 'U',
        'band': '> ' + cvalue,
        'recommend': cvalue,
        'devTarget': null
      })

      this.drawChart('lchart', lvalue)
      this.drawChart('achart', lamid)
      this.drawChart('cchart', acmid)
      this.drawChart('uchart', cvalue)
    },

    norminvCalc(avgValue, stdValue, extreType, typeValue) {
      if (extreType === 0) {
        // 极小型计算
        return norminv(typeValue, avgValue, stdValue)
      } else {
        // 极大型计算
        return -norminv(typeValue, -avgValue, stdValue)
      }
    },

    // 查询指标名称
    fetchCarIdxNames() {
      getUniqueIdxNames().then(response => {
        if (response.data) {
          this.options = response.data
          if (this.options.length > 0) {
            this.carIdxSelected = this.options[0]
            this.listLoading = true
            this.getPerformances(this.carIdxSelected)
          }
        } else {
          this.options = []
        }
      })
    },

    // 获取指定
    getPerformances(idxName) {
      if (!idxName) return
      const body = {
        'idxName': idxName
      }
      getPerformanceByIdx(body).then(value => {
        this.setPerformanceList(value.data)
        this.listLoading = false
      })
    },
    // 指标数据删除
    handleDelete(index, row) {
      const filtered = this.idxList.filter(e => {
        return e.id !== row.id
      })
      this.idxList = filtered
    },

    // 指标数据小数位特殊处理
    setPerformanceList(data) {
      data.forEach(element => {
        element.carIdxValue /= 1000
      })
      this.carServiceList = data
    },

    // 当选择的性能指标发生变化
    onIdxChange(idxName) {
      console.log(idxName)
      this.listLoading = true
      this.idxList = null
      this.carServiceSelected = null
      this.getPerformances(this.carIdxSelected)
    },

    // 当选择车系变化时
    onCmpServiceChange(item) {
      if (this.idxList == null) {
        this.idxList = []
      }
      const foundItem = this.carServiceList.find(c => {
        return c.carServiceName === item
      })
      this.idxList.push(foundItem)
    },
    drawChart(chartId, recommend) {
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(chartId))
      const xAxisData = []
      const serviceData = []
      xAxisData.push('推荐目标')
      serviceData.push(recommend)
      this.idxList.forEach(e => {
        xAxisData.push(e.carServiceName)
        serviceData.push(e.carIdxValue)
      })
      // 指定图表的配置项和数据
      const option = {
        color: ['#3398DB'],
        title: {
          text: ''
        },
        tooltip: {},
        legend: {
          data: ['性能值'],
          show: false
        },
        xAxis: {
          axisLabel: {
            interval: 0
          },
          data: xAxisData
        },
        yAxis: {},
        series: [
          {
            name: '性能值',
            type: 'bar',
            barWidth: 40,
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              normal: {
                // 定制显示（按顺序）
                color: function(params) {
                  if (params.dataIndex === 0) {
                    return '#FFC000'
                  } else {
                    return '#5B9BD5'
                  }
                }
              }
            },
            data: serviceData
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    onExtremChange() {
      // 极值类型切换，清除计算结果
      // L策略结果
      this.lresult = []
      // A策略结果
      this.aresult = []
      // C策略结果
      this.cresult = []
      // U策略结果
      this.uresult = []
    }
  }
}
</script>
<style scoped>
.row-idx {
  margin-block: 6px;
}
.margin-btn {
  margin-left: 6px;
}
</style>
