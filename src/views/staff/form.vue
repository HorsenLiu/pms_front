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

const defaultForm = {
  name: '',
  age: '',
  graduateSchool: '',
  degree: '',
  graduateTime: ''
};

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
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }]
      }
    };
  },
  // 监听
  watch: {
    // 当路由发生变化, 方法执行
    $route(to, from) {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // params表示路由中的参数, 指 path: 'edit/:id' 中类似:id的参数
      // 注意是route不是router
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.fetchDataById(id);
      } else {
        // 否则新增一条记录后, defaultForm就变成了之前新增的值
        // 使用对象拓展运算符, 拷贝对象, 而不是引用
        this.staff = { ...defaultForm };
      }
    },
    // 通过id获取项目
    fetchDataById(id) {
      staff
        .getStaffById(id)
        .then(response => {
          this.staff = response.data.staff;
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
          // 如果staff对象中有id, 说明是修改, 因为创建不需要输入id
          // 这个staff对象是后端返回给前端的, 不是data中的
          if (this.staff.id) {
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
    // 保存员工
    saveData() {
      staff
        .saveStaff(this.staff)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .then(response => {
          // 保存成功跳转到表格页面
          this.$router.push({ path: '/staff' });
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '保存失败'
          });
        });
    },
    // 修改员工
    updateData() {
      this.saveBtnDisabled = true;
      staff
        .updateStaff(this.staff)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        })
        .then(response => {
          this.$router.push({ path: '/staff' });
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
    }
  }
};
</script>