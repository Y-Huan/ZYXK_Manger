<template>
  <div class="app-container">
    <div class="search_box">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="open_add_role">新增角色</el-button>
    </div>
    <div class="table_box">
      <el-table
          :data="roleList"
          stripe
          border
          height="100%"
		  class="table"
          style="width: 100%">
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleComment"
            label="角色描述"
            width="500">
          </el-table-column>
          <el-table-column
            align="center"
            prop="creator"
            label="创建人"
            width="100">
          </el-table-column>
          <el-table-column
            sortable
            prop="createTime"
            label="创建日期"
            width="200">
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row.roleId)">编辑权限</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index,scope.row.roleId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="show_dialog" width="650px">
      <el-form :model="role_form">
        <el-form-item label="角色名称" label-width="120px" required>
          <el-input v-model.trim="role_form.roleName" clearable placeholder="请输入角色名称" maxlength="20" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px">
          <el-input type="textarea" rows="9" resize="none" style="width: 400px;" maxlength="200" placeholder="请输入角色描述" show-word-limit v-model.trim="role_form.roleComment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="add_role">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog title="编辑权限" :visible.sync="show_auth_dialog" width="500px">
      <el-tree
        style="max-height: 400px;overflow: auto;"
        :data="tree_list"
        show-checkbox
        ref="auth_tree"
        node-key="authorityId"
        :check-strictly="true"
        :check-on-click-node="true"
        :default-expand-all="true"
        :default-checked-keys="checked_tree"
        :props="{label:'authorityName'}">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_auth_dialog = false">取 消</el-button>
        <el-button type="primary" @click="update_role_auth">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {userRoles,addRole,getRoleAuth,updateAuth,delRole} from '@/api/user'
  export default{
    data(){
      return{
        roleList:[],
        authList:[],
        show_dialog:false,
        show_auth_dialog:false,
        roleId:'',
        roleName:'',
        role_form:{
          roleName:'',
          roleComment:''
        },
        checked_tree:[],
      }
    },
    computed:{
      tree_list(){
        if(this.authList.length){
          var arr = [];
          var checked = [];
          this.authList.map(el=>{
            arr.push({
              authorityName:el.menu.authorityName,
              authorityId:el.menu.authorityId,
              children:el.authorities
            })
            if(el.menu.isEnable){
              checked.push(el.menu.authorityId);
            }
            if(el.authorities.length){
              el.authorities.map(item=>{
                if(item.isEnable){
                  checked.push(item.authorityId);
                }
              })
            }
          })
          this.checked_tree = checked;
          return arr;
        }else{
          this.checked_tree = [];
          return [];
        }
      },
    },
    mounted() {
      this.getList();
    },
    methods:{
      getList(){
        userRoles().then(res=>{
          this.roleList = res.records;
          this.roleName = res.records.roleName;
        })
      },
      open_add_role(){
        this.role_form = {
          roleName:'',
          roleComment:''
        }
        this.show_dialog = true;
      },
      add_role(){
        if(!this.role_form.roleName){
          this.$message.error('请输入角色名称');
          return
        }
        addRole(this.role_form).then(res=>{
          this.$message.success('添加成功');
          this.getList();
          this.show_dialog = false;
        })
      },
      handleEdit(id){
        this.roleId = id;
        getRoleAuth({roleId:id}).then(res=>{
          this.authList = res;
          this.show_auth_dialog = true;
        })
      },
      update_role_auth(){
        var keys = this.$refs.auth_tree.getCheckedKeys();
        var data = {
          roleId:this.roleId,
          roleName:this.roleName,
          authoritys:this.authList
        }
        data.authoritys.map(el=>{
          if(keys.includes(el.menu.authorityId)){
            el.menu.isEnable = true;
          }else{
            el.menu.isEnable = false;
          }
          if(el.authorities.length){
            el.authorities.map(item=>{
              if(keys.includes(item.authorityId)){
                item.isEnable = true;
              }else{
                item.isEnable = false;
              }
            })
          }
        })
        this.authList = data;
        updateAuth(data).then(res=>{
        	this.$message.success('保存成功');
          this.show_auth_dialog = false;
        })
      },
      handleDelete(index,id){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
          var data = {roleId:id}
        	delRole({roleId:id}).then(res=>{
        		this.$message.success('删除成功');
        		this.roleList.splice(index,1);
        	})
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .search_box{
    .el-input,.el-select{
      margin-right: 4px;
    }
  }
  .table_box{
    flex:1;
    margin-top: 10px;
    overflow: hidden;
  }
</style>
