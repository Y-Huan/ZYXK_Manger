import http from '../utils/htpp'
//获取分院列表
export function collegeList(params) {
  return http.get('/college/list', params);
}
//创建分院
export function creatCollege(params) {
  return http.post('/college/add', params);
}
//修改分院信息
export function editCollege(params) {
  return http.post('/college/update', params);
}
//查看分院信息
export function getCollege(params) {
  return http.get('/college/detail', params);
}
//删除分院
export function delCollege(params) {
  return http.post('/college/del', params);
}

