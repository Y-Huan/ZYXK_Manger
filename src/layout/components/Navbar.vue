<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          {{userInfo.realName}}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="show_dialog=true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="show_dialog" :modal="false">
      <el-form>
        <el-form-item label="原密码" label-width="120px" required>
          <el-input v-model="oldpwd" type="password" show-password placeholder="请输入原密码" maxlength="20" style="width: 400px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px" required>
          <el-input v-model="pwd" type="password" show-password placeholder="请输入6-20位新密码" maxlength="20" style="width: 400px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px" required>
          <el-input v-model="re_pwd" type="password" show-password placeholder="再次输入新密码" maxlength="20" style="width: 400px;" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="editPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import {editPwd} from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
      'device'
    ])
  },
  data(){
    return{
      show_dialog:false,
      oldpwd:'',
      pwd:'',
      re_pwd:''
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    editPwd(){
      if(this.pwd.length<6){
        this.$message.error('密码长度不能小于6位');
        return
      }
      if(this.pwd != this.re_pwd){
        this.$message.error('两次密码输入不一致');
        return
      }
      var data = {
        newPassword:this.pwd,
        oldPassword:this.oldpwd,
      }
      editPwd(data).then(res=>{
        this.pwd = '';
        this.re_pwd = '';
        this.$store.commit('user/SET_INIT_INFO');
        this.show_dialog = false;
        this.$message.success('修改成功,请重新登录');
        this.$router.push('/login');
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      margin-right: 30px;
      user-select: none;
      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
