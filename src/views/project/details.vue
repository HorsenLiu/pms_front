<template>
  <div class="app-container">

    <p><b>项目信息</b></p>
    <el-table
      v-loading="listLoading"
      :data="projInfo"
      element-lodaing-text="数据加载中"
      fit
      border
      style="width:50%"
    >
      <el-table-column
        prop="id"
        label="ID"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名称"
        min-width="40%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        min-width="25%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        min-width="25%"
        align="center"
      >
      </el-table-column>
    </el-table>

    <p style="margin-top:30px"><b>成员分配</b></p>
    <!-- 穿梭框 -->
    <el-transfer
      filterable
      :titles="['员工列表', '项目成员']"
      :props="{key: 'key',label: 'value'}"
      v-model="groupMember"
      :data="staffList"
    ></el-transfer>
    <el-button
      type="primary"
      icon="el-icon-check"
      @click="assignStaff()"
      style="margin-top:20px"
    >确认</el-button>
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
      staffList: [], // 员工列表
      groupMember: [], // 项目成员
      searchObj: {},
      projId: '', // 项目ID
      isEmpty: '' // 项目成员为空
    };
  },
  created() {
    this.projId = this.$route.params.id;
    this.fetchData(this.projId);
    this.generateStaff(this.projId);
  },
  methods: {
    // 通过id获取项目
    fetchData(projId) {
      this.listLoading = true;
      project
        .getProjectById(projId)
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
    generateStaff(projId) {
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
        .getStaffIdsByProjId(projId)
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
    }
  }
};
</script>

<style>
.el-transfer-panel {
  width: 200px;
  height: 400px;
}
.el-transfer-panel__list.is-filterable {
  height: 300px;
}
</style>

