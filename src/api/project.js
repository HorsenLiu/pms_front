import request from '@/utils/request';
const api_name = '/project/';

export default {
  // 通过id获取项目
  getProjectById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    });
  },
  // 根据条件查询项目(分页)
  getProjectListByPage(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: searchObj
    });
  },
  // 根据ID删除一个项目
  removeProjectById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    });
  },
  // 新增一个项目
  saveProject(project) {
    return request({
      url: api_name,
      method: 'post',
      data: project
    });
  },
  // 修改一个项目
  updateProject(project) {
    return request({
      url: `${api_name}/${project.id}`,
      method: 'put',
      data: project
    });
  }
};
