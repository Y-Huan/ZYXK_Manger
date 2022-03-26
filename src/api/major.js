import http from '../utils/htpp'
//获取专业列表
export function majorList(params) {
  return http.get('/major/list', params);
}
//创建专业
export function creatMajor(params) {
  return http.post('/major/add', params);
}
//修改专业信息
export function editMajor(params) {
  return http.post('/major/update', params);
}
//查看专业信息
export function getMajor(params) {
  return http.get('/major/detail', params);
}
//删除专业
export function delMajor(params) {
  return http.post('/major/del', params);
}

