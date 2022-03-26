<template>
  <div class="app-container">
    <div class="search_box">
      <el-input v-model.trim="authority_name" clearable placeholder="权限名称" maxlength="11" style="width: 150px;"></el-input>
      <el-button-group>
        <el-button type="primary" icon="el-icon-search" @click="getList(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="restParams">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_authority">新增</el-button>
      </el-button-group>
    </div>
    <div class="table_box">
      <el-table
          :data="authorityList"
          stripe
          border
          height="100%"
		  class="table"
          style="width: 100%">
          <el-table-column
            prop="authorityName"
            label="权限名">
          </el-table-column>
          <el-table-column
            label="权限类型"
            width="150">
            <template slot-scope="scope">
              <span>{{scope.row.authorityType|typeToString}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="authorityUrl"
            align="center"
            label="权限地址"
            width="400">
          </el-table-column>
          <el-table-column
            prop="authorityPermission"
            label="权限编码"
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
                @click="handleEdit(scope.row.authorityId)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.authorityId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增用户 -->
    <el-dialog title="新增/编辑权限" :visible.sync="show_dialog" width="650px">
      <el-form :model="authority_form">
        <el-form-item label="权限名" label-width="120px" required clearable>
          <el-input v-model.trim="authority_form.authorityName" placeholder="请输入用户名" maxlength="10" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="权限地址" label-width="120px" required clearable>
          <el-input v-model.trim="authority_form.authorityUrl" placeholder="请输入权限地址"  style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="权限编码" label-width="120px" required clearable>
          <el-input v-model.trim="authority_form.authorityPermission" placeholder="请输入权限地址" maxlength="11" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="权限类别" label-width="120px" required>
          <el-select v-model="authority_form.authorityType" placeholder="请选择权限类别" style="width: 120px;">
            <el-option
              v-for="item in type_list"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级权限" label-width="120px" >
          <el-select v-model="authority_form.parentAuthorityId" placeholder="请选择父级权限" style="width: 400px;">
            <el-option
              v-for="item in authoritys"
              :key="item.authorityId"
              :label="item.authorityName"
              :value="item.authorityId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="add_authority">确 定</el-button>
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
  import {getAuthority,addAuthority,authorityDetail,disableUser,delAuthority,resetPwd,updateAuthority} from '@/api/user'
  export default{
    data(){
      return{
        type_list:[{name:'api',value:1},{name:'菜单',value:2},{name:'按钮',value:3}],
        authority_name:'',
        creat_time:'',
        parentAuthorityId:'',
        authorityList:[],
        authoritys:[],
        roles:[],
        roleId:'',
        total:0,
        current:1,
        show_dialog:false,
        authority_form:{
          authorityName:'',
          authorityUrl:'',
          authorityPermission:'',
          authorityType:'',
          parentAuthorityId:''
        }
      }
    },
    filters:{
      typeToString(val){
        if(val==2) return '菜单';
        if(val==1) return 'api';
        if(val == 3) return '按钮';
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
          selectStringKey:this.authority_name
        }
        getAuthority(data).then(res=>{
          this.authorityList = res.records;
          this.total = res.total;
          this.current = res.current;
        })
      },
      restParams(){
        this.authority_name = '';
      },
      open_add_authority(){
        this.authority_form={
          authorityName:'',
            authorityUrl:'',
            authorityPermission:'',
            authorityType:'',
          parentAuthorityId:''
        }
        getAuthority({pageNo: 1, pageSize: 300,selectLongKey:1}).then(res => {
          this.authoritys = res.records;
        })
        this.show_dialog = true;
      },
      add_authority(){
        var data = this.authority_form;
        if(!data.authorityName){
          this.$message.error('请输入权限名');
          return
        }

        if(!data.authorityType){
          this.$message.error('请选择权限类别');
          return
        }
        if(data.authorityType == 3){
          if(!data.parentAuthorityId){
            this.$message.error('按钮权限请选择所在菜单');
            return
          }
        }
        console.log(data);
        if(!data.authorityId){

          addAuthority(data).then(res=>{
            this.$message.success('添加成功');
            this.getList();
            this.show_dialog = false;
          })
        }else{
          updateAuthority(data).then(res=>{
            this.$message.success('保存成功');
            this.getList();
            this.show_dialog = false;
          })
        }
      },
      handleEdit(id){
        authorityDetail({authorityId:id}).then(res=>{
          this.authority_form={
            authorityName:res.authorityName,
            authorityUrl:res.authorityUrl,
            authorityPermission:res.authorityPermission,
            authorityType:res.authorityType,
            authorityId:res.authorityId,
            parentAuthorityId:res.parentAuthorityId
          }
          this.show_dialog = true;
          getAuthority({pageNo: 1, pageSize: 300, isEnable: true}).then(res => {
            this.authoritys = res.records;
          })
        })
      },
      handleDelete(id){
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          var data = {
            authorityId:id
          }
          delAuthority(data).then(res=>{
        		this.$message.success('删除成功');
        		this.getList();
        	})
        })
      },
      reset(uid){
      	resetPwd({uid}).then(res=>{
      		this.$message.success('操作成功');
      	})
      },
      switchUser(e,index,id,type){
        if(id==this.userInfo.userId){
          this.$message.warning('不能对自己进行操作');
          return
        }
        if(type==this.userInfo.type){
          this.$message.warning('不能改变该用户状态');
          return
        }
        disableUser({userId:id}).then(res=>{
          this.$message.success('操作成功');
          this.authorityList[index].isEnable = e;
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
