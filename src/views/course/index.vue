<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="college_name" clearable placeholder="分院名称" style="width: 200px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button v-if="hasAuth('addCourse')" type="primary" icon="el-icon-circle-plus-outline" @click="open_add_college">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="courseList"
          stripe
          border
		  class="table"
          height="100%"
          style="width: 100%">
          <el-table-column
            prop="courseName"
            label="课程名称">
          </el-table-column>
          <el-table-column
            prop="majorName"
            label="所属专业"
           >
          </el-table-column>
          <el-table-column
            label="课程类型"
            >
            <template slot-scope="scope">
              <span>{{scope.row.courseType|coursetypeToString}}</span>
            </template>
          </el-table-column>
        <el-table-column
          label="教学类型"
          >
          <template slot-scope="scope">
            <span>{{scope.row.teacherType|teacherypeToString}}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="choiceAmount"
          label="可选人数"
          width="200">
        </el-table-column>
          <el-table-column
            sortable
            prop="choiceTime"
            label="选择日期"
            width="200">
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="hasAuth('checkCourse')"
                size="mini"
                type="primary"
                @click="checkCourse(scope.$index,scope.row.courseId)">审核</el-button>
              <el-button
                v-if="hasAuth('student')"
                size="mini"
                type="primary"
                @click="choiceCourse(scope.$index,scope.row.courseId)">选择</el-button>
            </template>

          </el-table-column>
        </el-table>
    </div>
    <!-- 新增待审核课程 -->
    <el-dialog title="新增待审核课程" :visible.sync="show_dialog" width="650px">
      <el-form :model="course_form">
        <el-form-item label="课程名称" label-width="120px" required>
          <el-input v-model.trim="course_form.courseName" clearable placeholder="请输入学校名称" maxlength="30" style=" width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="授课老师" label-width="120px" required>
          <el-select v-model="course_form.teacherId" placeholder="请选择授课老师" style="width: 400px;"  filterable>
            <el-option
              v-for="item in teacherList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选课时间" label-width="120px" required>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="course_form.choiceTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 300px;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="教学类型" label-width="120px" required>
          <el-select v-model="course_form.teacherType" placeholder="请选择教学类型" style="width: 150px;">
            <el-option
              v-for="item in teacherTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="授课类型" label-width="120px" required>
          <el-select v-model="course_form.courseType" placeholder="请选择教学类型" style="width: 150px;">
            <el-option
              v-for="item in courseTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="授课地址" label-width="120px" required>
          <el-input v-model.trim="course_form.courseAddress" clearable placeholder="请输入授课地址" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="可选人数" label-width="120px" required>
          <el-input v-model.trim="course_form.choiceAmount" clearable placeholder="请输入可选人数" maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="add_course">确 定</el-button>
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
  import {courseList,addCourse,checkCourse,studentCourseList,studentChoiceCourse} from '@/api/course'
  import {getUsers} from '@/api/user'

  export default{
    data(){
      return{
        college_name:'',
        creat_time:'',
        courseList:[],
        courseTypeList:[{name:'专业必修',value:1},{name:'公共选修课',value:2}],
        teacherTypeList:[{name:'线上网课',value:1},{name:'线下教学',value:2}],
        total:0,
        current:1,
        editIndex:'',
        teacher:'',
        teachers:[],
        teacherList:[],
        show_dialog:false,
        course_form:{
          courseName:'',
          teacherId:'',
          courseType:'',
          courseAddress:'',
          choiceTime:'',
          choiceAmount:'',

        }
      }
    },

    mounted() {
      this.getList();
    },
    filters: {
      coursetypeToString(val) {
        if (val == 2) return '公共选修课';
        if (val == 1) return '专业选修课';
      },
      teacherypeToString(val){
        if (val == 2) return '线下教学';
        if (val == 1) return '线上网课';
      }


    },
    methods:{
       hasAuth (val){
        return this.$store.state.user.userInfo.authorityPermission.some(el=>{
          console.log( val)
          return el == val
        })
      },

      getList(page){
        var data = {
          pageNo:page||this.current,
          pageSize:30,
          selectStringKey:this.college_name,
        }
        if(this.hasAuth('student')) {
          studentCourseList().then(res=>{
            this.courseList = res;
          })
        }else {
          courseList(data).then(res=>{
          this.courseList = res.records;
          this.total = res.total;
          this.current = res.current;
          })
        }
      },
      restParams(){
        this.college_name = '';
      },
      open_add_college(){
        this.course_form={
          courseName:'',
          teacherId:'',
          courseType:'',
          courseAddress:''
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
      add_course(){
        var data =this.course_form;
        if(!this.course_form.courseName){
          this.$message.error('请输入课程名称');
          return
        }

        console.log(data)
          addCourse(data).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
      },
      checkCourse(index,id){
        this.$confirm('是否通过审核?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          var data = {
            courseId:id,
            auditStatus:1
          }
          checkCourse(data).then(res=>{
            this.$message.success('审核通过');
            this.schoolList.splice(index,1);
          })
        }).catch(() => {
          var data = {
            courseId:id,
            auditStatus:2
          }
          checkCourse(data).then(res=>{
            this.$message.success('驳回成功');
            this.schoolList.splice(index,1);
          })
        });

      },
      choiceCourse(index,id){
        this.editIndex = index;
        var data ={
          courseId:id
        }
        this.$confirm('是否选择该课程？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          studentChoiceCourse(data).then(res=>{
            this.$message.success('选择成功');
            this.getList();
          })
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
