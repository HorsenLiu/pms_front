<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16">
        <p><b>项目信息</b></p>
        <el-table
          v-loading="listLoading"
          :data="projInfo"
          element-lodaing-text="数据加载中"
          fit
          border
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
            min-width="35%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            min-width="15%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            min-width="15%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="30%"
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
                  type="warning"
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
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <p style="margin-top:30px"><b>任务列表</b></p>
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
            prop="name"
            label="任务名称"
            min-width="25%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            min-width="15%"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            min-width="15%"
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
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="warning"
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
          @current-change="getTask"
        />
      </el-col>

      <el-col :span="8">
        <p style="margin-top:30px"><b>新建任务</b></p>
        <el-form
          label-position="right"
          label-width="80px"
          :rules="rules"
          :model="task"
          ref="taskForm"
        >
          <el-form-item
            label="任务名称"
            prop="name"
          >
            <el-input
              v-model="task.name"
              clearable
              style="width:300px"
            />
          </el-form-item>
          <el-form-item
            label="开始时间"
            prop="startTime"
          >        
            <el-date-picker
               v-model="task.startTime"
               type="date"
               placeholder="选择开始时间"
               value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="结束时间"
            prop="endTime"
          >        
            <el-date-picker
               v-model="task.endTime"
               type="date"
               placeholder="选择结束时间"
               value-format="yyyy-MM-dd"
            />      
          </el-form-item>
          <el-form-item
            label="负责人"
            prop="staffId"
          >        
            <el-select
              v-model="task.staffId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in staffNames"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :disable="saveBtnDisabled"
              type="primary"
              @click="saveTask('taskForm')"
            >保存</el-button>
            <el-button @click="resetForm('taskForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import project from '@/api/project';
import task from '@/api/task';
import staff from '@/api/staff';

export default {
  inject: ['reload'],
  data() {
    return {
      projInfo: null, // 项目信息
      projId: '', // 项目ID
      staffNames: [], // 员工姓名
      listLoading: true, // 是否显示loading信息
      list: null, // 任务列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {}, // 查询条件
      task: {
        name: '',
        startTime: '',
        endTime: '',
        staffId: ''
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        endTime: [{ validator: this.checkEndTime, trigger: 'change' }]
      }
    };
  },
  created() {
    this.projId = this.$route.params.id;
    this.searchObj = { projId: this.projId };
    this.task.projId = this.projId;
    this.getProject();
    this.getTask();
    this.getStaffNames();
  },
  methods: {
    // 页面跳转
    toEdit(id) {
      this.$router.push('/project/edit/' + id);
    },
    toMember(id) {
      this.$router.push('/project/member/' + id);
    },
    toEditTask(id) {
      this.$router.push('/task/edit/' + id);
    },
    // 通过id获取项目
    getProject() {
      this.listLoading = true;
      project
        .getProjectById(this.projId)
        .then(response => {
          let array = [];
          array.push(response.data.project);
          this.projInfo = array;
          this.listLoading = false;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取项目信息失败'
          });
        });
    },
    // 获取任务列表
    getTask(page = 1) {
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
    // 获取员工姓名
    getStaffNames() {
      staff
        .getStaffNamesByProjId(this.projId)
        .then(response => {
          this.staffNames = response.data.names;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取员工姓名失败'
          });
        });
    },
    // 保存任务
    saveTask() {
      task
        .saveTask(this.task)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .then(response => {
          // 保存成功刷新页面
          this.reload();
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '保存失败'
          });
        });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 校验结束时间
    checkEndTime(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择结束时间'));
      } else {
        if (!this.task.startTime) {
          callback(new Error('请选择开始时间'));
        } else if (Date.parse(this.task.startTime) >= Date.parse(value)) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      }
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
          this.getTask();
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
  margin-bottom: 20px;
}
</style>

