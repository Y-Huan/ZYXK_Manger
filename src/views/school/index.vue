<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="school_name" clearable placeholder="学校名称" style="width: 200px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_company">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="schoolList"
          stripe
          border
		  class="table"
          height="100%"
          style="width: 100%">
          <el-table-column
            prop="schoolName"
            label="学校名称">
          </el-table-column>
          <el-table-column
            prop="schoolAddress"
            label="学校地址"
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
                @click="handleEdit(scope.$index,scope.row.schoolId)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index,scope.row.schoolId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增学校 -->
    <el-dialog title="新增/编辑学校" :visible.sync="show_dialog" width="650px">
      <el-form :model="school_form">
        <el-form-item label="学校名称" label-width="120px" required>
          <el-input v-model.trim="school_form.schoolName" clearable placeholder="请输入学校名称" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="学校地址" label-width="120px">
          <el-input v-model.trim="school_form.schoolAddress" clearable placeholder="请输入学校地址" maxlength="50" style="width: 400px;"></el-input>
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
  import {schoolList,creatSchool,editSchool,getSchool,delSchool} from '@/api/school'
  export default{
    data(){
      return{
        school_name:'',
        isEnable:'',
        creat_time:'',
        schoolList:[],
        total:0,
        current:1,
        editIndex:'',
        show_dialog:false,
        school_form:{
          schoolName:'',
          schoolAddress:''
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
          selectStringKey:this.school_name,

        }
        if(this.creat_time&&this.creat_time.length){
          data.startDate =  this.creat_time[0];
          data.endDate =  this.creat_time[1];
        }
        schoolList(data).then(res=>{
          this.schoolList = res.records;
          this.total = res.total;
          this.current = res.current;
        })
      },
      restParams(){
        this.school_name = '';
        this.creat_time = [];
      },
      open_add_company(){
        this.school_form = {
          schoolName:'',
          schoolAddress:''
        }
        this.show_dialog = true;
      },
      add_company(){
        if(!this.school_form.schoolName){
          this.$message.error('请输入学校名称');
          return
        }
        console.log(this.school_form.schoolId)
        if(!this.school_form.schoolId){
          creatSchool(this.school_form).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
        }else{
          editSchool(this.school_form).then(res=>{
            this.$message.success('保存成功');
            this.schoolList[this.editIndex].schoolName = this.school_form.schoolName;
            this.schoolList[this.editIndex].schoolAddress = this.school_form.schoolAddress;
            this.show_dialog = false;
            this.$forceUpdate();
          })
        }
      },
      handleEdit(index,id){
        this.editIndex = index;
        var data ={
          schoolId:id
        }
        getSchool(data).then(res=>{
          this.school_form = {
            schoolName:res.schoolName,
            schoolAddress:res.schoolAddress,
            schoolId:id
          }
          this.show_dialog = true;
        })
      },
      handleDelete(index,id){
        this.$confirm('此操作将永久删除该学校, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          delSchool({schoolId:id}).then(res=>{
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
