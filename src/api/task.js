import request from '@/utils/request';
const api_name = '/task/';

export default {
  // 通过id获取任务
  getTaskById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    });
  },
  // 根据条件查询任务(分页)
  getTaskListByPage(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: searchObj
    });
  },
  // 根据ID删除一个任务
  removeTaskById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    });
  },
  // 新增一个任务
  saveTask(task) {
    return request({
      url: api_name,
      method: 'post',
      data: task
    });
  },
  // 修改一个任务
  updateTask(task) {
    return request({
      url: `${api_name}/${task.id}`,
      method: 'put',
      data: task
    });
  }
};
