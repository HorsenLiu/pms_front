import request from '@/utils/request';
const api_name = '/projStaff/';

export default {
  // 根据项目ID删除对应所有项目_员工
  removeProjtSaffById(projId) {
    return request({
      url: `${api_name}/${projId}`,
      method: 'delete'
    });
  },
  // 新增一个项目_员工
  saveProjStaff(projId, staffIds) {
    return request({
      url: `${api_name}/${projId}`,
      method: 'post',
      data: staffIds
    });
  }
};
