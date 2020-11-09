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
  }
};
