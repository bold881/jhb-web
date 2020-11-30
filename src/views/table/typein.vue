<template>
  <div class="app-container">
    <el-row>
      <el-col :span="3">
        <el-select v-model="carIdxSelected" filterable allow-create default-first-option placeholder="指标选择" size="medium">
          <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="onAddIdxBtnClick()">新增指标</el-button>
      </el-col>
    </el-row>
    <el-divider />
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="竞品名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="车型值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="指标新增" :visible.sync="addIdxDlgVisible" width="30%">
      <el-input v-model="addIdxDlgData.carIdxName" placeholder="指标名称" class="row-idx" />
      <el-input v-model="addIdxDlgData.carServiceName" placeholder="竞品名称" class="row-idx" />
      <el-input v-model="addIdxDlgData.carIdxValue" placeholder="车型值" class="row-idx" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleAddIdxDlgClose()">新增并继续</el-button>
        <el-button size="mini" @click="addIdxDlgVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUniqueIdxNames } from '@/api/table'

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
      list: null,
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
    handleAddIdxDlgClose() {
      this.addIdxDlgVisible = false
      console.log('指标窗口关闭')
    },

    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },

    // 查询指标名称
    fetchCarIdxNames() {
      getUniqueIdxNames().then(response => {
        if (response.data) {
          this.options = response.data
          if (this.options.length > 0) {
            this.carIdxSelected = this.options[0]
          }
        } else {
          this.options = []
        }
      })
    }
  }
}
</script>
<style scoped>
.row-idx {
  margin-block: 6px;
}
</style>
