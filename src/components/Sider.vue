<template>
  <div>
    <el-button id="SiderButton" @click="drawer = true" type="success" plain icon="el-icon-s-operation"></el-button>

    <el-drawer
        title="Bonjour, étranger."
        :visible.sync="drawer"
        :direction="direction"
        size="350px"
        :before-close="handleClose">

      <div style="text-align: left">
        <el-avatar id="SiderAvatar" :size="80" :src="avatar"></el-avatar>
        <div class="poem">百川東到海</div>
        <div class="poem">何時復西歸</div>
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

      avatar: 'https://bloglmc.oss-cn-hangzhou.aliyuncs.com/14a6def2-b546-4968-9bad-2d3b3f62997f_ul164125579-7.jpg',

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
      },{
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
    let years = this.$store.getters.getYears
    years.forEach(year => {
      this.data[2].children.push({"label": year})
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
  font-size: 16px !important;
}

#SiderAvatar {
  margin-left: 40%;
}

.poem {
  margin-left: 38.5%;
  font-size: 18px;
}


</style>


