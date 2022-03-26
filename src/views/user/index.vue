<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="phone" clearable placeholder="手机号码" maxlength="11" style="width: 150px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_user">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="userList"
          stripe
          border
          height="100%"
		  class="table"
          style="width: 100%">
          <el-table-column
            prop="teacherName"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号码"
            width="150">
          </el-table-column>
          <el-table-column
            prop="roleName"
            align="center"
            label="角色"
            width="400">
          </el-table-column>
          <el-table-column
            align="center"
            label="性别"
            width="100">
             <template slot-scope="scope">
               <span>{{scope.row.sex|sexToString}}</span>
             </template>
          </el-table-column>
          <el-table-column
            v-if="userInfo.type==3"
            prop="schoolName"
            label="所属学校"
            width="350">
          </el-table-column>
          <el-table-column
            sortable
            prop="createTime"
            label="创建日期"
            width="200">
          </el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row.teacherId)">编辑</el-button>
              <el-button type="warning" size="mini" @click="reset(scope.row.teacherId)">重置密码</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.teacherId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增用户 -->
    <el-dialog title="新增/编辑用户" :visible.sync="show_dialog" width="650px">
      <el-form :model="teacher_form">
        <el-form-item label="用户名" label-width="120px" required clearable>
          <el-input v-model.trim="teacher_form.teacherName" placeholder="请输入用户名" maxlength="10" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px" required clearable>
          <el-input v-model.trim="teacher_form.phone" placeholder="请输入用户手机号码" maxlength="11" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="所属学校" label-width="120px" >
          <el-select v-model="schoolId" placeholder="请选择学校" style="width: 400px;">
              <el-option
                v-for="item in schoolList"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" label-width="120px" >
          <el-select v-model="roles" placeholder="请选择用户角色" style="width: 400px;" multiple filterable>
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" required>
          <el-select v-model="teacher_form.sex" placeholder="请选择性别" style="width: 120px;">
              <el-option
                v-for="item in sex_list"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="add_user">确 定</el-button>
      </div>
    </el-dialog>
    <div class="page_box" v-if="total>15">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="getList"
        :page-size="15"
        :current-page.sync="current"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getUsers,addUser,userRoles,getUser,disableUser,delUser,resetPwd} from '@/api/user'
  import {schoolList} from '@/api/school'
  export default{
    data(){
      return{
        status_list:[{name:'启用',value:true},{name:'禁用',value:false}],
        sex_list:[{name:'男',value:1},{name:'女',value:2}],
        type_list:[{name:'普通用户',value:1},{name:'公司管理员',value:2},{name:'超级管理员',value:3}],
        user_name:'',
        phone:'',
        company_name:'',
        user_type:'',
        isEnable:'',
        creat_time:'',
        userList:[],
        schoolList:[],
        schoolId:'',
        roleList:[],
        roles:[],
        roleId:'',
        total:0,
        current:1,
        show_dialog:false,
        teacher_form:{
          teacherName:'',
          phone:'',
          sex:''

        }
      }
    },
    filters:{
      sexToString(val){
        if(val==2) return '女';
        if(val==1) return '男';
        return '男'
      },
      role(val){
        if(!val){
        	return '暂无'
        }else{
        	return val.replace(/,/g,'、');
        }
      }
    },
    computed:{
      userInfo(){
        return this.$store.state.user.userInfo;
      }
    },
    mounted() {
      this.getList();

    },
    methods:{
      getList(page){
        var data = {
          page:page||this.current,
          pageSize:15,
          selectStringKey:this.phone
        }
        getUsers(data).then(res=>{
          this.userList = res.records;
          this.total = res.total;
          this.current = res.current;
        })
      },
      restParams(){
        this.user_name = '';
        this.isEnable = '';
        this.creat_time = '';
        this.user_phone = '';
        this.roleId = '';
        this.company_name = '';
        this.user_type = '';
      },
      open_add_user(){
        this.teacher_form ={
          teacherName:'',
          phone:'',
            sex:''
        }
        this.companyId = '';
        this.roles = [];
        var data = {
          pageNo:1,
          pageSize:300,
          selectStringKey:''
        }
        console.log(data)
        this.schoolId = '';
        schoolList(data).then(res=>{
          this.schoolList = res.records;
        })
        userRoles(data).then(res=>{
          this.roleList = res.records;
        })

        this.show_dialog = true;
      },
      add_user(){
        var data = this.teacher_form;
        if(!data.teacherName){
          this.$message.error('请输入用户名');
          return
        }
        if(!/1[0-9]{10}/.test(data.phone)){
          this.$message.error('请输入正确的手机号码');
          return
        }
        if(!data.sex){
          this.$message.error('请选择用户性别');
          return
        }
        data.roleId = this.roles.join();
        data.schoolId = this.schoolId;
        console.log(data);
        if(!data.teacherId){
          addUser(data).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
        }else{
          disableUser(data).then(res=>{
            this.$message.success('保存成功');
            this.getList();
            this.show_dialog = false;
          })
        }
      },
      handleEdit(id){

        getUser({teacherId:id}).then(res=>{
          this.teacher_form = {
            teacherName:res.teacherName,
            phone:res.phone,
            sex:res.sex,
            teacherId:id
          }
          this.schoolId = res.schoolId;
          if(res.roleIds){
            this.roles = res.roleIds.split(',');
          }
          var data = {
            pageNo:1,
            pageSize:300,
            selectStringKey:''
          }
          console.log(data)
          schoolList(data).then(res=>{
            this.schoolList = res.records;
          })
          userRoles(data).then(res=>{
            this.roleList = res.records;
          })
          this.show_dialog = true;
        })
      },
      handleDelete(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          var data = {
            teacherId:id
          }
        	delUser(data).then(res=>{
        		this.$message.success('删除成功');
        		this.getList();
        	})
        })
      },
      reset(uid){
        var data = {
          teacherId:uid
        }
        console.log(data)
      	resetPwd(data).then(res=>{
      		this.$message.success('操作成功');
      	})
      }

    }
  }
</script>

<style lang="scss" scoped>
  .search_box{
    .el-input,.el-select,.el-date-editor{
      margin-right: 4px;
    }
  }
  .table_box{
    flex:1;
    margin-top: 10px;
    overflow: hidden;
  }
</style>
