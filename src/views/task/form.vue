<template>
  <div class="app-container">
    <el-form
      label-position="right"
      label-width="80px"
      :rules="rules"
      :model="task"
      ref="taskForm"
    >
      <el-form-item
        label="项目名称"
        prop="projName"
      >
        <el-input
          v-model="task.projName"
          disabled
          style="width:300px"
        />
      </el-form-item>
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
          @click="updateTask('taskForm')"
        >保存</el-button>
        <el-button @click="resetForm('taskForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import task from '@/api/task';
import staff from '@/api/staff';

const defaultForm = {
  name: '',
  startTime: '',
  endTime: '',
  staffId: ''
};

export default {
  data() {
    return {
      task: {
        name: '',
        startTime: '',
        endTime: '',
        staffId: ''
      },
      staffNames: [], // 员工姓名
      saveBtnDisabled: false, // 保存按钮是否禁用
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        endTime: [{ validator: this.checkEndTime, trigger: 'change' }]
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
    // 获取员工姓名
    getStaffNames(id) {
      staff
        .getStaffNamesByProjId(id)
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
    // 通过id获取任务
    fetchDataById(id) {
      task
        .getTaskById(id)
        .then(response => {
          this.task = response.data.task;
          this.getStaffNames(this.task.projId);
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          });
        });
    },
    // 修改验证
    updateTask(formName) {
      this.saveBtnDisabled = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果task对象中有id, 说明是修改, 因为创建不需要输入id
          // 这个task对象是后端返回给前端的, 不是data中的
          if (this.task.id) {
            this.updateData();
          }
        } else {
          console.log('error submit');
          return false;
        }
      });
    },
    // 修改任务
    updateData() {
      this.saveBtnDisabled = true;
      task
        .updateTask(this.task)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        })
        .then(response => {
          this.$router.go(-1);
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
    }
  }
};
</script>