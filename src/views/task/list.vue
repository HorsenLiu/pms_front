<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-input
          v-model="searchObj.name"
          placeholder="任务名称"
        />
      </el-form-item>       
      <el-date-picker
         v-model="searchObj.startTime"
         type="date"
         placeholder="选择开始时间"
         value-format="yyyy-MM-dd"
      />      
      <el-form-item>        
        <el-date-picker
           v-model="searchObj.endTime"
           type="date"
           placeholder="选择结束时间"
           value-format="yyyy-MM-dd"
        />     
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="fetchData()"
      >查询</el-button>
      <el-button
        type="default"
        @click="resetData()"
      >清空</el-button>    
    </el-form>

    <!-- :data 用于存放请求数据回来的数组 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-lodaing-text="数据加载中"
      fit
      border
      highlight-current-row
      stripe
    >
      <el-table-column
        prop="id"
        label="ID"
        min-width="5%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="任务名称"
        min-width="20%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="projName"
        label="隶属项目"
        min-width="20%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="staffName"
        label="负责人"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="时间进度"
        min-width="10%"
        align="center"
      >
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="15"
            :percentage="getPercentage(scope.row)"
            :color="getColor(scope.row)"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="15%"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              plain
              @click="toEdit(scope.row.id)"
            >修改</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              plain
              @click="removeDataById(scope.row.id)"
            >删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->    
    <el-pagination
      background
      :hide-on-single-page="true"
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import task from '@/api/task';
export default {
  // 定义数据
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {} // 查询条件
    };
  },
  // 当前页面加载时获取数据
  created() {
    this.fetchData();
  },
  // 调用api层获取数据库中的数据
  methods: {
    // 页面跳转
    toEdit(id) {
      this.$router.push('/task/edit/' + id);
    },
    // 获取数据
    fetchData(page = 1) {
      this.page = page;
      this.listLoading = true;
      task
        .getTaskListByPage(this.page, this.limit, this.searchObj)
        // 请求成功
        .then(response => {
          if (response.success === true) {
            this.list = response.data.items;
            this.total = response.data.total;
          }
          this.listLoading = false;
        })
        // 请求失败
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          });
        });
    },
    // 清空
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },
    // 删除数据
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 点击确定执行then()
        .then(() => {
          return task.removeTaskById(id);
        })
        .then(() => {
          this.fetchData();
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        })
        // 点击取消执行catch()
        .catch(response => {
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          }
        });
    },
    // 计算任务进度百分比
    getPercentage(row) {
      if (row.endTime == null || row.startTime == null) {
        row.percentage = 0;
        return 0;
      }
      let today = new Date();
      let totalDays = (Date.parse(row.endTime) - Date.parse(row.startTime)) / (1 * 60 * 60 * 1000);
      let pastDays = (today.getTime() - Date.parse(row.startTime)) / (1 * 60 * 60 * 1000);
      let percentage = Math.round((pastDays / totalDays) * 100);
      if (percentage >= 100) {
        row.percentage = 100;
        return 100;
      }
      if (percentage <= 0) {
        row.percentage = 0;
        return 0;
      }
      row.percentage = percentage;
      return percentage;
    },
    // 确定进度条颜色
    getColor(row) {
      let percentage = row.percentage;
      //let percentage = this.getPercentage(row);
      if (percentage >= 0 && percentage < 51) {
        return '#67c23a';
      } else if (percentage >= 51 && percentage < 80) {
        return '#e6a23c';
      } else if (percentage == 100) {
        return '#409eff';
      } else {
        return '#f56c6c';
      }
    }
  }
};
</script>