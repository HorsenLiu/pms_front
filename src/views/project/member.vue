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

    <el-row>
      <p><b>成员分配</b></p>
      <!-- 穿梭框 -->
      <el-transfer
        filterable
        :titles="['员工列表', '项目成员']"
        :props="{key: 'key',label: 'value'}"
        v-model="groupMember"
        :data="staffList"
      ></el-transfer>
    </el-row>

    <el-row>
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="assignStaff()"
      >确认</el-button>
    </el-row>
  </div>
</template>

<script>
import project from '@/api/project';
import staff from '@/api/staff';
import projStaff from '@/api/projStaff';
export default {
  data() {
    return {
      listLoading: 'true',
      projInfo: null, // 项目信息
      searchObj: {},
      staffList: [], // 员工列表
      groupMember: [], // 项目成员
      projId: '', // 项目ID
      isEmpty: '' // 项目成员为空
    };
  },
  created() {
    this.projId = this.$route.params.id;
    this.fetchData();
    this.generateStaff();
  },
  methods: {
    // 页面跳转
    toEdit(id) {
      this.$router.push('/project/edit/' + id);
    },
    toMission(id) {
      this.$router.push('/project/mission/' + id);
    },
    // 通过id获取项目
    fetchData() {
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
    // 生成员工姓名
    generateStaff() {
      staff
        .getStaffNames(this.searchObj)
        .then(response => {
          if (response.success === true) {
            this.staffList = response.data.names;
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取员工姓名失败'
          });
        });
      staff
        .getStaffIdsByProjId(this.projId)
        .then(response => {
          this.isEmpty = response.data.isEmpty;
          if (response.success === true && !this.isEmpty) {
            this.groupMember = response.data.ids;
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取员工ID失败'
          });
        });
    },
    // 分配项目成员
    assignStaff() {
      if (!this.isEmpty) {
        projStaff.removeProjtSaffById(this.projId).then(response => {
          if (response.success === true) {
            console.log('删除成功');
          }
          this.saveProjStaff();
        });
      } else {
        this.saveProjStaff();
      }
    },
    // 保存项目_员工
    saveProjStaff() {
      projStaff.saveProjStaff(this.projId, this.groupMember).then(response => {
        if (response.success === true) {
          console.log('保存成功');
          this.$message({
            type: 'success',
            message: '分配成功'
          });
        }
      });
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
    }
  }
};
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
.el-transfer-panel {
  width: 225px;
  height: 400px;
}
.el-transfer-panel__list.is-filterable {
  height: 300px;
}
.el-row {
  margin-bottom: 20px;
}
</style>

