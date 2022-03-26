import http from '../utils/htpp'
//获取学校列表
export function schoolList(params) {
  return http.get('/school/list', params);
}
//创建学校
export function creatSchool(params) {
  return http.post('/school/addSchool', params);
}
//修改公司信息
export function editSchool(params) {
  return http.post('/school/update', params);
}
//查看公司信息
export function getSchool(params) {
  return http.get('/school/detail', params);
}
//删除学校
export function delSchool(params) {
  return http.post('/school/delSchool', params);
}

