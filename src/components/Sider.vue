<template>
  <div>
    <el-button @click="drawer = true" type="success" plain style="margin-left: 10%;margin-top: 10px;font-size: smaller; " icon="el-icon-s-operation"></el-button>

    <el-drawer
        title="Bonjour, étranger."
        :visible.sync="drawer"
        :direction="direction"
        size="350px"
        :before-close="handleClose">

      <div style="text-align: left">
        <el-avatar :size="80" :src="avatar" style="margin-left: 40%"></el-avatar>
        <div style="margin-left: 135px; font-size: 18px;">百川東到海</div>
        <div style="margin-left: 135px; font-size: 18px;">何時復西歸</div>
      </div>

      <el-tree
          :data="data"
          :indent="30"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick">
      </el-tree>

    </el-drawer>



  </div>
</template>

<script>

export default {
  name: "Sider",
  data() {
    return {

      avatar: 'http://81.68.192.120:8081/upload/img/20211118224937/14a6def2-b546-4968-9bad-2d3b3f62997f_ul164125579-7.jpg',

      input: '',
      drawer: false,
      direction: 'ltr',
      data: [{
        label: 'About',
      }, {
        label: 'Blogs',
      },{
        label: 'Archive',
        children: [
        // ,{
        //     label: '2021'
        //   }
        ]
      }, {
        label: 'my little airport'
      }
        ,{
          label: 'Copyright'
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    handleClose(done) {
      done()
    },
    handleNodeClick(data) {
      if (data.children && data.children.length !== 0) {
        return
      }
      switch (data.label) {
        case 'Blogs':
          this.$router.push("/public/blogs/1")
          this.drawer = false
          break
        case 'About':
          this.$router.push("/")
          break
        case 'my little airport':
          window.open().location.href = '/mla.html';
          this.drawer = false
          break
        case 'Copyright':
          window.open().location.href = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
          this.drawer = false
          break
        default :
          this.$router.push("/public/blogs/" + data.label + "/1")
          this.drawer = false
      }
    }
  },
  created() {
    this.$axios.get('/searchYears').then(res => {
      let years = res.data.data
      years.forEach(year => {
        this.data[2].children.push({"label": year})
      })
    })
  },

  //同一个组件，路由改变时如果内容不变，如此解决
  // watch: {
  //   $route(to,from){
  //     // created:{}里面的方法
  //   }
  //
  // }
};
</script>

<style lang="less">

.el-drawer__header {
  font-size: 20px;
}

.el-drawer__body {
  overflow: auto;
}

.el-tree-node:hover>.el-tree-node__content {
  background-color: #fff;
  color: deepskyblue;
}

.el-tree-node__content {
  height: 45px !important;
  font-size: xx-large;
}

.el-tree-node__label {
  font-size: 16px;
}




</style>


