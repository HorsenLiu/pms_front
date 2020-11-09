<template>
  <div class="app-container">
    <el-form
      label-position="right"
      label-width="80px"
      :rules="rules"
      :model="staff"
      ref="staffForm"
    >
      <el-form-item
        label="员工姓名"
        prop="name"
      >
        <el-input
          v-model="staff.name"
          clearable
          style="width:300px"
        />
      </el-form-item>

      <el-form-item
        label="年龄"
        prop="age"
      >
        <el-input
          v-model="staff.age"
          clearable
          style="width:300px"
        />
      </el-form-item>

      <el-form-item
        label="毕业学校"
        prop="graduateSchool"
      >
        <el-input
          v-model="staff.graduateSchool"
          clearable
          style="width:300px"
        />
      </el-form-item>

      <el-form-item
        label="学历"
        prop="degree"
      >
        <el-input
          v-model="staff.degree"
          clearable
          style="width:300px"
        />
      </el-form-item>

      <el-form-item
        label="毕业时间"
        prop="graduateTime"
      >
        <el-date-picker
           v-model="staff.graduateTime"
           type="date"
           value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disable="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate('staffForm')"
        >保存</el-button>
        <el-button @click="resetForm('staffForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import staff from '@/api/staff';
export default {
  data() {
    return {
      staff: {
        name: '',
        age: '',
        graduateSchool: '',
        degree: '',
        graduateTime: ''
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        endTime: [{ validator: this.checkEndTime, trigger: 'change' }]
      }
    };
  },
  created() {
    // params表示路由中的参数, 指 path: 'edit/:id' 中类似:id的参数
    // 注意是route不是router
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.fetchDataById(id);
    }
  },
  methods: {
    // 通过id获取项目
    fetchDataById(id) {
      staff
        .getProjectById(id)
        .then(response => {
          this.project = response.data.staff;
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          });
        });
    },
    // 新建或修改
    saveOrUpdate(formName) {
      this.saveBtnDisabled = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果project对象中有id, 说明是修改, 因为创建不需要输入id
          // 这个project对象是后端返回给前端的, 不是data中的
          if (this.project.id) {
            this.updateData();
          } else {
            this.saveData();
          }
        } else {
          console.log('error submit');
          return false;
        }
      });
    },
    // 保存数据
    saveData() {
      project
        .saveStaff(this.project)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .then(response => {
          // 保存成功跳转到表格页面
          this.$router.push({ path: '/project' });
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
        if (!this.staff.startTime) {
          callback(new Error('请选择开始时间'));
        } else if (Date.parse(this.staff.startTime) >= Date.parse(value)) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      }
    }
  }
};
</script>