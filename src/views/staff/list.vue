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
          placeholder="员工姓名"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchObj.age"
          placeholder="年龄"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchObj.graduateSchool"
          placeholder="毕业学校"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchObj.degree"
          placeholder="学历"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchObj.graduateTime"
          placeholder="毕业时间"
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
        label="员工姓名"
        min-width="15%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="graduateSchool"
        label="毕业学校"
        min-width="20%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="degree"
        label="学历"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="graduateTime"
        label="毕业时间"
        min-width="15%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="25%"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="success"
              size="small"
              icon="el-icon-tickets"
              plain
              @click="toDetails(scope.row.id)"
            >详情</el-button>
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
import staff from '@/api/staff';
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
      this.$router.push('/staff/edit/' + id);
    },
    toDetails(id){
      this.$router.push('/staff/details/' + id);
    },
    // 获取数据
    fetchData(page = 1) {
      this.page = page;
      this.listLoading = true;
      staff
        .getStaffListByPage(this.page, this.limit, this.searchObj)
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
          return staff.removeStaffById(id);
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
    }
  }
};
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
</style>