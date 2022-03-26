import http from '../utils/htpp'
//登录
export function login(params) {
  return http.get('/login/info', params);
}
//退出登录
export function logout(params) {
  return http.get('/login/logout', params);
}
//修改密码
export function editPwd(params) {
  return http.put1('/login/ChangePassword', params);
}
//重置密码
export function resetPwd(params) {
  return http.post('/teacher/resetPwd', params);
}
//用户列表
export function getUsers(params) {
  return http.get('/teacher/list', params);
}
//新增用户
export function addUser(params) {
  return http.post('/teacher/add', params);
}
//角色列表
export function userRoles() {
  return http.get('/role/list');
}
//获取用户
export function getUser(params) {
  return http.get('/teacher/detail', params);
}
//修改教师信息
export function disableUser(params) {
  return http.post('/teacher/update', params);
}
//删除用户
export function delUser(params) {
  return http.post('/teacher/delete', params);
}
//新增角色
export function addRole(params) {
  return http.post('/role/addRole', params);
}
//获取角色权限列表
export function getRoleAuth(params) {
  return http.get('/role/roleAuthorityList', params);
}
//更新角色权限
export function updateAuth(params) {
  return http.post('/role/updateRole', params);
}
//删除角色
export function delRole(params) {
  return http.post('/role/delRole', params);
}
//权限列表
export function getAuthority(params) {
  return http.get('/authority/list', params);
}
//新增权限
export function addAuthority(params) {
  return http.post('/authority/addAuthority', params);
}
//编辑权限
export function updateAuthority(params) {
  return http.post('/authority/updateAuthority', params);
}
//权限信息
export function authorityDetail(params) {
  return http.get('/authority/detail', params);
}
//编辑权限
export function delAuthority(params) {
  return http.post('/authority/delAuthority', params);
}
