import http from '../utils/htpp'
//获取课程列表
export function courseList(params) {
  return http.get('/course/list', params);
}
export function studentCourseList(params) {
  return http.get('/course/student/courseList', params);
}
//创建课程
export function addCourse(params) {
  return http.post('/course/add', params);
}
//审核课程
export function checkCourse(params) {
  return http.post('/course/checkCourse', params);
}
//创建课程
export function studentChoiceCourse(params) {
  return http.post('/course/choice', params);
}
//查看班级信息
export function getClase(params) {
  return http.get('/clase/detail', params);
}
//删除学校
export function delClase(params) {
  return http.post('/clase/del', params);
}
//学生列表
export function studentList(params){
  return http.get('/student/list', params);
}
//创建学号
export function studentNumber(){
  return http.get('/student/creatorNumber');
}
//创建学生
export function addStudent(params){
  return http.post('/student/add', params);
}
//删除学生
export function delStudent(params){
  return http.post('/student/del', params);
}

