<template>
  <div class="app-container">
    <el-select v-model="value" filterable allow-create default-first-option placeholder="指标选择" size="medium">
      <el-option v-for="item in options" :key="item" :label="item" :value="item" />
    </el-select>
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
      list: null,
      listLoading: false,
      options: [],
      value: []
    }
  },
  created() {
    this.fetchCarIdxNames()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    fetchCarIdxNames() {
      getUniqueIdxNames().then(response => {
        if (response.data) {
          this.options = response.data
        } else {
          this.options = []
        }
      })
    }
  }
}
</script>
