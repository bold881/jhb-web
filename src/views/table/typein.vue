<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="carIdxSelected" filterable allow-create default-first-option placeholder="指标选择" size="medium" @change="onIdxChange">
        <el-option v-for="item in options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="margin-btn" type="primary" size="small" @click="onAddIdxBtnClick()">新增指标</el-button>
    </el-row>
    <el-divider />
    <el-table v-loading="listLoading" :data="idxList" element-loading-text="Loading" border fit highlight-current-row>
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
    <el-dialog title="指标新增" :visible.sync="addIdxDlgVisible" width="30%">
      <el-input v-model="addIdxDlgData.carIdxName" placeholder="指标名称" class="row-idx" />
      <el-input v-model="addIdxDlgData.carServiceName" placeholder="竞品名称" class="row-idx" />
      <el-input v-model="addIdxDlgData.carIdxValue" placeholder="车型值" class="row-idx" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="onAddIdxAndContinue()">新增并继续</el-button>
        <el-button size="mini" @click="addIdxDlgVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUniqueIdxNames,
  addPerformanceIdx,
  getPerformanceByIdx,
  deleteById } from '@/api/table'

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
      addIdxDlgData: {
        carIdxName: '',
        carServiceName: '',
        carIdxValue: ''
      }
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
    onAddIdxAndContinue() {
      if (this.addIdxDlgData.carIdxName.length < 1 || this.addIdxDlgData.carServiceName.length < 1 || this.addIdxDlgData.carIdxValue.length < 1) {
        return this.$message({ message: '请输入！', type: 'warning' })
      }
      addPerformanceIdx(this.addIdxDlgData).then(value => {
        this.setPerformanceList(value.data)
        this.addIdxDlgData.carServiceName = ''
        this.addIdxDlgData.carIdxValue = ''
      })
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
    handleDelete(index, row) {
      const body = {
        'id': row.id,
        'idxName': row.carIdxName
      }
      deleteById(body).then(ret => {
        this.setPerformanceList(ret.data)
      })
    },
    setPerformanceList(data) {
      data.forEach(element => {
        element.carIdxValue /= 1000
      })
      this.idxList = data
    },
    // 指标选择变化
    onIdxChange(idxName) {
      console.log(idxName)
      this.listLoading = true
      this.getPerformances(this.carIdxSelected)
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
