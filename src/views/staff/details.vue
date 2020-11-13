<template>
  <div class="app-container">
    <el-row>
      <el-col :span="colSpan">
        <p><b>员工信息</b></p>
        <el-table
          v-loading="listLoading"
          :data="staffInfo"
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
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  plain
                  @click="toEditStaff(scope.row.id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  plain
                  @click="removeStaffById(scope.row.id)"
                >删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="colSpan">
        <p><b>参与项目</b></p>
        <el-table
          v-loading="listLoading"
          :data="projInfo"
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
            label="项目名称"
            min-width="25%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            min-width="8%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            min-width="8%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="staffNames"
            label="项目成员"
            min-width="20%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="时间进度"
            min-width="8%"
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
            min-width="26%"
            align="center"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-user"
                  plain
                  @click="toMember(scope.row.id)"
                >成员</el-button>
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-tickets"
                  plain
                  @click="toMission(scope.row.id)"
                >任务</el-button>
                <el-button
                  type="warning"
                  size="small"
                  icon="el-icon-edit"
                  plain
                  @click="toEditProj(scope.row.id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  plain
                  @click="removeProjById(scope.row.id)"
                >删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->    
        <el-pagination
          background
          :hide-on-single-page="true"
          :current-page="projPage"
          :page-size="limit"
          :total="projTotal"
          style="padding: 30px 0; text-align: center;"
          layout="total, prev, pager, next, jumper"
          @current-change="getProject"
        />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="colSpan">
        <p><b>负责任务</b></p>
        <el-table
          v-loading="listLoading"
          :data="taskInfo"
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
            min-width="25%"
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
            min-width="20%"
            align="center"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  plain
                  @click="toEditTask(scope.row.id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  plain
                  @click="removeTaskById(scope.row.id)"
                >删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->    
        <el-pagination
          background
          :hide-on-single-page="true"
          :current-page="taskPage"
          :page-size="limit"
          :total="taskTotal"
          style="padding: 30px 0; text-align: center;"
          layout="total, prev, pager, next, jumper"
          @current-change="getTask"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import staff from '@/api/staff';
import project from '@/api/project';
import task from '@/api/task';

export default {
  data() {
    return {
      colSpan: 24,
      listLoading: true, // 是否显示loading信息
      projTotal: 0, // 总记录数
      taskTotal: 0, // 总记录数
      projPage: 1, // 页码
      taskPage: 1, // 页码
      limit: 3, // 每页记录数
      searchObj: {}, // 查询条件
      staffInfo: null, // 员工信息
      projInfo: null, // 项目列表
      taskInfo: null, // 任务列表
      staffId: '' // 员工ID
    };
  },
  created() {
    this.staffId = this.$route.params.id;
    this.searchObj = { staffId: this.staffId };
    this.getStaff();
    this.getProject();
    this.getTask();
  },
  methods: {
    // 页面跳转
    toEditStaff(id) {
      this.$router.push('/staff/edit/' + id);
    },
    toEditProj(id) {
      this.$router.push('/project/edit/' + id);
    },
    toEditTask(id) {
      this.$router.push('/task/edit/' + id);
    },
    toMember(id) {
      this.$router.push('/project/member/' + id);
    },
    toMission(id) {
      this.$router.push('/project/mission/' + id);
    },
    // 通过ID获取员工
    getStaff() {
      this.listLoading = true;
      staff
        .getStaffById(this.staffId)
        .then(response => {
          let array = [];
          array.push(response.data.staff);
          this.staffInfo = array;
          this.listLoading = false;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取项目信息失败'
          });
        });
    },
    // 通过员工ID获取项目
    getProject(projPage = 1) {
      project
        .getProjectByStaffId(this.projPage, this.limit, this.staffId)
        .then(response => {
          if (response.success === true) {
            this.projInfo = response.data.items;
            this.projTotal = response.data.total;
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
    // 通过员工ID获取任务
    getTask(page = 1) {
      task
        .getTaskListByPage(this.taskPage, this.limit, this.searchObj)
        .then(response => {
          if (response.success === true) {
            this.taskInfo = response.data.items;
            this.taskTotal = response.data.total;
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
    // 删除员工
    removeStaffById(id) {
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
    },
    // 删除项目
    removeProjById(id) {
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 点击确定执行then()
        .then(() => {
          return project.removeProjectById(id);
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
    // 删除任务
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

<style>
.el-table th.gutter {
  display: table-cell !important;
}
.el-row {
  margin-bottom: 10px;
}
</style>
