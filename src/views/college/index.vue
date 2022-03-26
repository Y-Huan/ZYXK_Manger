<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="college_name" clearable placeholder="分院名称" style="width: 200px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_college">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="collegeList"
          stripe
          border
		  class="table"
          height="100%"
          style="width: 100%">
          <el-table-column
            prop="collegeName"
            label="分院名称">
          </el-table-column>
          <el-table-column
            prop="dean"
            label="院长"
            width="500">
          </el-table-column>
          <el-table-column
            prop="deanPhone"
            label="院长手机号"
            width="500">
          </el-table-column>
          <el-table-column
            sortable
            prop="createTime"
            label="创建日期"
            width="200">
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index,scope.row.collegeId)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index,scope.row.collegeId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增学校 -->
    <el-dialog title="新增/编辑分院" :visible.sync="show_dialog" width="650px">
      <el-form :model="college_form">
        <el-form-item label="分院名称" label-width="120px" required>
          <el-input v-model.trim="college_form.collegeName" clearable placeholder="请输入学校名称" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="院长" label-width="120px" >
          <el-select v-model="teacher" placeholder="请选择分院院长" style="width: 400px;"  filterable>
            <el-option
              v-for="item in teacherList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="add_college">确 定</el-button>
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
  import {collegeList,creatCollege,editCollege,getCollege,delCollege} from '@/api/college'
  import {getUsers} from '@/api/user'
  export default{
    data(){
      return{
        college_name:'',
        creat_time:'',
        collegeList:[],
        total:0,
        current:1,
        editIndex:'',
        teacher:'',
        teachers:[],
        teacherList:[],
        show_dialog:false,
        college_form:{
          collegeName:'',
          dean:''
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
          selectStringKey:this.college_name,
        }
        collegeList(data).then(res=>{
          this.collegeList = res.records;
          this.total = res.total;
          this.current = res.current;
        })
      },
      restParams(){
        this.college_name = '';
      },
      open_add_college(){
        this.college_form={
          collegeName:'',
          bean:''
        }
        var data = {
          pageNo:1,
          pageSize:3000,
        }
        getUsers(data).then(res=>{
          this.teacherList= res.records;
        })
        this.show_dialog = true;
      },
      add_college(){
        var data =this.college_form;
        if(!this.college_form.collegeName){
          this.$message.error('请输入学校名称');
          return
        }
        data.dean = this.teacher;
        console.log(data)
        if(!this.college_form.collegeId){
          creatCollege(data).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
        }else{
          editCollege(data).then(res=>{
            this.$message.success('保存成功');
            this.collegeList[this.editIndex].collegeName = this.college_form.collegeName;
            this.collegeList[this.editIndex].bean = this.college_form.bean;
            this.show_dialog = false;
            this.$forceUpdate();
          })
        }
      },
      handleEdit(index,id){
        this.editIndex = index;
        var data ={
          collegeId:id
        }
        getCollege(data).then(res=>{
          this.college_form={
            collegeName:res.collegeName,
            collegeId:res.collegeId
          }
          this.teacher=res.dean;
          var data2 = {
            pageNo:1,
            pageSize:3000,
          }
          getUsers(data2).then(res=>{
            this.teacherList= res.records;
          })
          this.show_dialog = true;
        })
      },
      handleDelete(index,id){
        this.$confirm('此操作将永久删除该学校, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          delCollege({collegeId:id}).then(res=>{
        		this.$message.success('删除成功');
        		this.schoolList.splice(index,1);
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
