import http from '../utils/htpp'
//获取学校列表
export function claseList(params) {
  return http.get('/clase/list', params);
}
//创建学校
export function creatClase(params) {
  return http.post('/clase/add', params);
}
//修改公司信息
export function editClase(params) {
  return http.post('/clase/update', params);
}
//查看班级信息
export function getClase(params) {
  return http.get('/clase/detail', params);
}
//删除学校
export function delClase(params) {
  return http.post('/clase/del', params);
}

