import request from '@/utils/request';
const api_name = '/staff/';

export default {
  // 通过id获取员工
  getStaffById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    });
  },
  // 根据条件查询员工(分页)
  getStaffListByPage(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: searchObj
    });
  },
  // 根据条件查询员工姓名
  getStaffNames(searchObj) {
    return request({
      url: `${api_name}/names`,
      method: 'post',
      data: searchObj
    });
  },
  // 根据项目ID查询员工ID
  getStaffIdsByProjId(id) {
    return request({
      url: `${api_name}/ids/${id}`,
      method: 'get'
    });
  },
  // 根据项目ID查询员工姓名
  getStaffNamesByProjId(id) {
    return request({
      url: `${api_name}/names/${id}`,
      method: 'get'
    });
  },
  // 根据ID删除一个员工
  removeStaffById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    });
  },
  // 新增一个员工
  saveStaff(staff) {
    return request({
      url: api_name,
      method: 'post',
      data: staff
    });
  },
  // 修改一个员工
  updateStaff(staff) {
    return request({
      url: `${api_name}/${staff.id}`,
      method: 'put',
      data: staff
    });
  }
};
