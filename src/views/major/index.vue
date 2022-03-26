<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="major_name" clearable placeholder="专业名称" style="width: 200px;"></el-input>
      <el-input v-model.trim="phone" clearable placeholder="专业负责人号码" style="width: 200px;"></el-input>
      <el-input v-model.trim="personInChargeName" clearable placeholder="专业负责人" style="width: 200px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_major">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="majorList"
          stripe
          border
		  class="table"
          height="100%"
          style="width: 100%">
          <el-table-column
            prop="majorName"
            label="专业名称">
          </el-table-column>
          <el-table-column
            prop="collegeName"
            label="所属分院"
            >
          </el-table-column>
        <el-table-column
          prop="personInChargeName"
          label="专业负责人"
          >
        </el-table-column>
          <el-table-column
            prop="phone"
            label="负责人手机号"
            >
          </el-table-column>
          <el-table-column label="操作"  align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="publish(scope.$index,scope.row.majorId)">发布选修课</el-button>

              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index,scope.row.majorId)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index,scope.row.majorId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增学校 -->
    <el-dialog title="新增/编辑专业" :visible.sync="show_dialog" width="650px">
      <el-form :model="major_form">
        <el-form-item label="专业名称" label-width="120px" required>
          <el-input v-model.trim="major_form.majorName" clearable placeholder="请输入学校名称" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="所在分院" label-width="120px" >
          <el-select v-model="college" placeholder="请选择所在分院" style="width: 400px;"  filterable>
            <el-option
              v-for="item in collegeList"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业负责人" label-width="120px" >
          <el-select v-model="teacher" placeholder="请选择专业负责人" style="width: 400px;"  filterable>
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
  import {majorList,creatMajor,editMajor,getMajor,delMajor} from '@/api/major'
  import {getUsers} from '@/api/user'
  import {collegeList} from '@/api/college'
  export default{
    data(){
      return{
        major_name:'',
        personInChargeName:'',
        phone:'',
        teacher:'',
        teachers:[],
        teacherList:[],
        college:'',
        collegeList:[],
        majorList:[],
        total:0,
        current:1,
        editIndex:'',
        show_dialog:false,
        major_form:{
          majorName:'',
          personInChargeId:''
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
          majorName:this.major_name,
          personInChargeName:this.personInChargeName,
          phone:this.phone
        }
        if(this.creat_time&&this.creat_time.length){
          data.startDate =  this.creat_time[0];
          data.endDate =  this.creat_time[1];
        }
        majorList(data).then(res=>{
          this.majorList = res.records;
          this.total = res.total;
          this.current = res.current;
        })
      },
      restParams(){
        this.major_name = '';
        this.phone = '';
        this.personInChargeName = '';
      },
      open_add_major(){
        this.major_form={
          majorName:'',
          personInChargeId:''
        }
        var data = {
          pageNo:1,
          pageSize:3000,
        }
        getUsers(data).then(res=>{
          this.teacherList= res.records;
        })
        collegeList(data).then(res=>{
          this.collegeList= res.records;
        })

        this.show_dialog = true;
      },
      add_company(){
        if(!this.major_form.majorName){
          this.$message.error('请输入专业名称');
          return
        }
        this.major_form.personInChargeId = this.teacher;
        this.major_form.collegeId = this.college;
        console.log(this.major_form)
        if(!this.major_form.majorId){
          creatMajor(this.major_form).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
        }else{
          editMajor(this.major_form).then(res=>{
            this.$message.success('保存成功');
            this.getList();
            this.show_dialog = false;
            this.$forceUpdate();
          })
        }
      },
      handleEdit(index,id){
        this.editIndex = index;
        var data ={
          majorId:id
        }
        getMajor(data).then(res=>{
          this. major_form={
            majorName:res.majorName,
            personInChargeId:res.personInChargeId,
            majorId:id
          }
          this.teacher=res.personInChargeId;
          this.college= res.collegeId;
          var data2 = {
            pageNo:1,
            pageSize:3000,
          }
          getUsers(data2).then(res=>{
            this.teacherList= res.records;
          })
          collegeList(data2).then(res=>{
            this.collegeList= res.records;
          })
          this.show_dialog = true;
        })
      },
      publish(index,id){
        this.$router.push('');
      },
      handleDelete(index,id){
        this.$confirm('此操作将永久删除该学校, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          delMajor({majorId:id}).then(res=>{
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
