<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="carIdxSelected" default-first-option placeholder="指标选择" size="medium" @change="onIdxChange">
        <el-option v-for="item in options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="extreTypeSelected" default-first-option placeholder="极值类型" size="medium" class="margin-btn" @change="onExtremChange">
        <el-option v-for="item in extremumType" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="strategySelected" default-first-option placeholder="策略" size="medium" class="margin-btn">
        <el-option v-for="item in strategies" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="margin-btn" type="primary" size="small" @click="doCalc()">执行</el-button>
    </el-row>
    <el-row class="row-idx">
      <el-select v-model="carServiceSelected" filterable default-first-option placeholder="计算车型选择" size="medium" @change="onSingleSelChange">
        <el-option v-for="item in carServiceList" :key="item.carServiceName" :label="item.carServiceName" :value="item.carServiceName" />
      </el-select>
    </el-row>
    <el-divider />
    <el-button class="margin-btn" type="primary" size="small" @click="doTableExport">导出</el-button>
    <el-row :style="{'display': (strategySelected === 'L' ? 'block' : 'none')}">
      <p>策略L：</p>
      <el-col :span="12">
        <el-table ref="Lreport-table" :data="lresult" border>
          <el-table-column prop="idxName" label="性能指标" align="center" />
          <el-table-column prop="strategy" label="策略" align="center" />
          <el-table-column prop="band" label="带宽" align="center" />
          <el-table-column prop="recommend" label="推荐目标" align="center" />
          <el-table-column prop="devTarget" label="开发车目标" align="center">
            <template scope="scope">
              <el-input v-model="scope.row.devTarget" size="small" class="textarea" placeholder="" @change="onDevTargetChange(scope.$index, scope.row)" />
              <span style="display:none;">{{scope.row.devTarget}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="lchart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <el-row :style="{'display': (strategySelected === 'A' ? 'block' : 'none')}">
      <p>策略A：</p>
      <el-col :span="12">
        <el-table ref="Areport-table" :data="aresult" border>
          <el-table-column prop="idxName" label="性能指标" align="center" />
          <el-table-column prop="strategy" label="策略" align="center" />
          <el-table-column prop="band" label="带宽" align="center" />
          <el-table-column prop="recommend" label="推荐目标" align="center" />
          <el-table-column prop="devTarget" label="开发车目标" align="center">
            <template scope="scope">
              <el-input v-model="scope.row.devTarget" size="small" class="textarea" placeholder="" @change="onDevTargetChange(scope.$index, scope.row)" />
              <span style="display:none;">{{scope.row.devTarget}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="achart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <el-row :style="{'display': (strategySelected === 'C' ? 'block' : 'none')}">
      <p>策略C：</p>
      <el-col :span="12">
        <el-table ref="Creport-table" :data="cresult" border>
          <el-table-column prop="idxName" label="性能指标" align="center" />
          <el-table-column prop="strategy" label="策略" align="center" />
          <el-table-column prop="band" label="带宽" align="center" />
          <el-table-column prop="recommend" label="推荐目标" align="center" />
          <el-table-column prop="devTarget" label="开发车目标" align="center">
            <template scope="scope">
              <el-input v-model="scope.row.devTarget" size="small" class="textarea" placeholder="" @change="onDevTargetChange(scope.$index, scope.row)" />
              <span style="display:none;">{{scope.row.devTarget}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="cchart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <el-row :style="{'display': (strategySelected === 'U' ? 'block' : 'none')}">
      <p>策略U：</p>
      <el-col :span="12">
        <el-table ref="Ureport-table" :data="uresult" border>
          <el-table-column prop="idxName" label="性能指标" align="center" />
          <el-table-column prop="strategy" label="策略" align="center" />
          <el-table-column prop="band" label="带宽" align="center" />
          <el-table-column prop="recommend" label="推荐目标" align="center" />
          <el-table-column prop="devTarget" label="开发车目标" align="center">
            <template scope="scope">
              <el-input v-model="scope.row.devTarget" size="small" class="textarea" placeholder="" @change="onDevTargetChange(scope.$index, scope.row)" />
              <span style="display:none;">{{scope.row.devTarget}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div id="uchart" style="width: 600px;height:250px;" />
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="14">
        <el-table ref="multipleTable" border :data="carServiceList" highlight-current-row @selection-change="onCmpServiceChange">
          <el-table-column type="selection" />
          <el-table-column align="center" label="编号">
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
        </el-table>
      </el-col>
      <el-col :span="10">
        <el-table v-loading="listLoading" border :data="idxList" element-loading-text="Loading" fit highlight-current-row>
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
        </el-table>
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
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

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
      strategies: [
        'L', 'A', 'C', 'U'
      ],
      extreTypeSelected: null,
      // L策略结果
      lresult: [],
      // A策略结果
      aresult: [],
      // C策略结果
      cresult: [],
      // U策略结果
      uresult: [],
      // 选中的策略
      strategySelected: ''
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
      this.onExtremChange()
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

      this.drawChart('lchart', this.lresult[0].devTarget)
      this.drawChart('achart', this.aresult[0].devTarget)
      this.drawChart('cchart', this.cresult[0].devTarget)
      this.drawChart('uchart', this.uresult[0].devTarget)
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
      this.idxList = item
    },
    drawChart(chartId, recommend) {
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(chartId))
      const xAxisData = []
      const serviceData = []
      xAxisData.push('开发车目标')
      serviceData.push(recommend)
      this.idxList.forEach(e => {
        xAxisData.push(e.carServiceName)
        serviceData.push(e.carIdxValue)
      })
      // 指定图表的配置项和数据
      const option = {
        toolbox: {
          feature: {
            saveAsImage: {
              title: '保存为图片'
            }
          }
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
    },
    onDevTargetChange(idx, row) {
      if (row.strategy === 'L') {
        this.drawChart('lchart', this.lresult[0].devTarget)
      }
      if (row.strategy === 'A') {
        this.drawChart('achart', this.aresult[0].devTarget)
      }
      if (row.strategy === 'C') {
        this.drawChart('cchart', this.cresult[0].devTarget)
      }
      if (row.strategy === 'U') {
        this.drawChart('uchart', this.uresult[0].devTarget)
      }
    },
    onSingleSelChange(item) {
      const foundItem = this.carServiceList.find(c => {
        return c.carServiceName === item
      })
      this.toggleSelection([foundItem])
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    exportExcel(excelName, refName) {
      try {
        const $e = this.$refs[`${refName}`].$el
        let $table = $e.querySelector('.el-table__fixed')
        if (!$table) {
          $table = $e
        }
        // 为了返回单元格原始字符串，设置{ raw: true }
        const wb = XLSX.utils.table_to_book($table, { raw: true })
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${excelName}.xlsx`)
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.error(e)
        }
      }
    },
    doTableExport() {
      this.exportExcel(this.strategySelected, this.strategySelected + 'report-table')
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
.textarea >>>.el-input__inner{
  border: none;
}
</style>
