<template>
  <div class="app-container"  >

    <el-descriptions title="基本信息">
      <el-descriptions-item label="班级名称">{{clase_name}}</el-descriptions-item>
      <el-descriptions-item label="所属专业">{{majorName}}</el-descriptions-item>

      <el-descriptions-item label="班主任">{{headmasterName}}</el-descriptions-item>
      <el-descriptions-item label="班主任手机号">{{headmasterPhone}}</el-descriptions-item>
    </el-descriptions>



    <div class="search_box">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_student">新增</el-button>

    </div>
    <div class="table_box">
      <el-table
          :data="studentList"
          stripe
          border
		  class="table"
          height="100%"
          style="width: 100%">
          <el-table-column
            prop="studentNumber"
            label="学号">
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="学生姓名"
            >
          </el-table-column>

        <el-table-column
          prop="phone"
          label="手机号"
        >
        </el-table-column>
          <el-table-column label="操作" width="400" align="center">

            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index,scope.row.studentId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增班级 -->
    <el-dialog title="新增学生" :visible.sync="show_dialog" width="650px">
      <el-form :model="student_form">
        <el-form-item label="学生名称" label-width="120px" required>
          <el-input v-model.trim="student_form.studentName" clearable placeholder="请输入学生名称" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="学号" label-width="120px" required>
          <el-input v-model.trim="student_form.studentNumber" clearable placeholder="请输入学号" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" required>
          <el-input v-model.trim="student_form.phone" clearable placeholder="请输入手机号" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" required>
          <el-select v-model="student_form.sex" placeholder="请选择性别" style="width: 120px;">
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
        <el-button type="primary" @click="add_company">确 定</el-button>
      </div>
    </el-dialog>
    <div class="page_box" v-if="total>30">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="getList"
        :page-size="30"
        :current-page.sync="current"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    claseList,
    creatClase,
    editClase,
    getClase,
    delClase,
    studentList,
    studentNumber,
    addStudent,
    delStudent
  } from '@/api/cleas'
  import {majorList} from '@/api/major'
  import {getUsers} from '@/api/user'
  export default{
    data(){
      return{
        sex_list:[{name:'男',value:1},{name:'女',value:2}],
        clase_name:'',
        claseId:this.$route.params.id,
        majorName:'',
        headmasterName:'',
        headmasterPhone:'',
        student_name:'',
        excelPutUrl:process.env.VUE_APP_BASE_API+'/login/studentInfo',

        isEnable:'',
        creat_time:'',
        claseList:[],
        total:0,
        current:1,
        editIndex:'',
        show_dialog:false,
        studentList:[],
        teacher:'',
        teacherList:[],
        major:'',
        majorList:[],
        student_form : {
          studentName:'',
          sex:'',
          studentNumber:'',
          phone:''
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
      token(){
        return this.$store.state.user.token;
      }
    },
    mounted() {
      this.getList();
    },
    methods:{
      getList(){
        var data ={
          claseId:this.$route.params.id
        }
        getClase(data).then(res=>{
          console.log(res)
          this.clase_name = res.claseName;
          this.majorName = res.majorName;
          this.headmasterName = res.headmasterName;
          this.headmasterPhone =res.headmasterPhone;
        })
        studentList(data).then(res=>{
          this.studentList = res;
        })
      },
      restParams(){
        this.school_name = '';
        this.creat_time = [];
      },
      open_add_student(){
        this.student_form = {
          claseName:'',
          teacherId:''
        }
        var data = {
          pageNo:1,
          pageSize:3000,
        }
        studentNumber().then(res=>{

          this.student_form.studentNumber = res;
          this.$forceUpdate();
          console.log( this.student_form.studentNumber);
        })
        this.show_dialog = true;
      },
      add_company(){

        var data = this.student_form;
        this.student_form.claseId = this.claseId;
        this.$forceUpdate();
        if(!data.studentName){
          this.$message.error('请输入学生名称');
          return
        }
        if(!data.studentNumber){
          this.$message.error('请输入学号');
          return
        }
        if(!data.sex){
          this.$message.error('请选择性别');
          return
        }

          addStudent(this.student_form).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })

      },
      claseDetail(index,id){
        this.$router.push('/major/claseDetail/'+id);
      },
      handleEdit(index,id){
        this.editIndex = index;
        var data ={
          claseId:id
        }
        console.log(data)
        getClase(data).then(res=>{
          this.student_form = {
            claseId:id,
            claseName:res.claseName,

          }
          this.teacher=res.teacherId,
           this.major=res.majorId
          var data2 = {
            pageNo:1,
            pageSize:3000,
          }
          getUsers(data2).then(res=>{
            this.teacherList= res.records;
          })
          majorList(data2).then(res=>{
            this.majorList= res.records;
          })
          this.show_dialog = true;
        })
      },
      handleDelete(index,id){
        this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          delStudent({studentId:id}).then(res=>{
        		this.$message.success('删除成功');
            this.getList();
        	})
        })
      },

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
