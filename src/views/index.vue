<template>
  <div class="container">
    <h2>欢迎使用浙邮选课系统</h2>
  </div>
</template>

<script>
  import {userRoles} from '@/api/user'
  export default {
    name: 'DashboardEditor',
    data() {
      return {

      }
    },
    computed: {

    },
    mounted() {
      var data = {
        page:1,
        pageSize:15
      }
      userRoles(data).then(res=>{})
    }
  }
</script>

<style scoped="" lang="scss">
  h2{
    text-align: center;
    padding-top: 50px;
  }
</style>
