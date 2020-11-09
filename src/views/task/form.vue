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
      <el-form-item>
        <el-button
          :disable="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate('taskForm')"
        >保存</el-button>
        <el-button @click="resetForm('taskForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import task from '@/api/task';
export default {
  data() {
    return {
      task: {
        name: '',
        startTime: '',
        endTime: ''
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
      task
        .getTaskById(id)
        .then(response => {
          this.task = response.data.task;
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
          // 如果task对象中有id, 说明是修改, 因为创建不需要输入id
          // 这个task对象是后端返回给前端的, 不是data中的
          if (this.task.id) {
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
      task
        .saveTask(this.task)
        .then(response => {
          return this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .then(response => {
          // 保存成功跳转到表格页面
          this.$router.push({ path: '/task' });
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