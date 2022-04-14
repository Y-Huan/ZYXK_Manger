<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="clase_name" clearable placeholder="班级名称" style="width: 200px;"></el-input>
      <el-input v-model.trim="major_name" clearable placeholder="专业名称" style="width: 200px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_clase">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="claseList"
          stripe
          border
		  class="table"
          height="100%"
          style="width: 100%">
          <el-table-column
            prop="claseName"
            label="班级名称">
          </el-table-column>
          <el-table-column
            prop="majorName"
            label="所属专业"
            >
          </el-table-column>

        <el-table-column
          prop="headmasterName"
          label="班主任"
        >
        </el-table-column>
        <el-table-column
          prop="headmasterPhone"
          label="班主任手机号"
          >
        </el-table-column>
          <el-table-column
            sortable
            prop="createTime"
            label="创建日期"
            >
          </el-table-column>
          <el-table-column label="操作" width="400" align="center">

            <template slot-scope="scope">

              <el-button
                size="mini"
                type="primary"
                @click="claseDetail(scope.$index,scope.row.claseId)">管理班级</el-button>

              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index,scope.row.claseId)">编辑</el-button>

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index,scope.row.claseId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增班级 -->
    <el-dialog title="新增/编辑班级" :visible.sync="show_dialog" width="650px">
      <el-form :model="clase_form">
        <el-form-item label="班级名称" label-width="120px" required>
          <el-input v-model.trim="clase_form.claseName" clearable placeholder="请输入班级名称" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="班主任" label-width="120px" >
          <el-select v-model="teacher" placeholder="请选择班主任" style="width: 400px;"  filterable>
            <el-option
              v-for="item in teacherList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" label-width="120px" >
          <el-select v-model="major" placeholder="请选择专业" style="width: 400px;"  filterable>
            <el-option
              v-for="item in majorList"
              :key="item.majorId"
              :label="item.majorName"
              :value="item.majorId">
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
  import {claseList,creatClase,editClase,getClase,delClase} from '@/api/cleas'
  import {majorList} from '@/api/major'
  import {getUsers} from '@/api/user'
  export default{
    data(){
      return{
        clase_name:'',
        major_name:'',
        isEnable:'',
        creat_time:'',
        claseList:[],
        total:0,
        current:1,
        editIndex:'',
        show_dialog:false,
        teacher:'',
        teacherList:[],
        major:'',
        majorList:[],
        clase_form : {
          claseName:'',
          teacher:'',
          college:''
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods:{
      getList(page){
        var data = {
          pageNo:page||this.current,
          pageSize:30,
          claseName:this.clase_name,
          majorName:this.major_name
        }
        claseList(data).then(res=>{
          this.claseList = res.records;
          this.total = res.total;
          this.current = res.current;
        })
      },
      restParams(){
        this.school_name = '';
        this.creat_time = [];
      },
      open_add_clase(){
        this.clase_form = {
          claseName:'',
          teacherId:''
        }
        var data = {
          pageNo:1,
          pageSize:3000,
        }
        getUsers(data).then(res=>{
          this.teacherList= res.records;
        })
        majorList(data).then(res=>{
          this.majorList= res.records;
        })
        this.show_dialog = true;
      },
      add_company(){

        var data = this.clase_form;
        data.teacherId = this.teacher;
        data.majorId = this.major;

        if(!data.claseName){
          this.$message.error('请输入班级名称');
          return
        }
        if(!data.teacherId){
          this.$message.error('请选择班主任');
          return
        }
        if(!data.majorId){
          this.$message.error('请选择专业');
          return
        }


        if(!this.clase_form.claseId){
          creatClase(this.clase_form).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
        }else{
          editClase(this.clase_form).then(res=>{
            this.$message.success('保存成功');
            this.show_dialog = false;
            this.getList();
          })
        }
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
          this.clase_form = {
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
        this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          delClase({claseId:id}).then(res=>{
        		this.$message.success('删除成功');
        		this.claseList.splice(index,1);
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
