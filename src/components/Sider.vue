<template>
  <div>
    <el-button @click="drawer = true" type="success" plain style="margin-left: 10%;margin-top: 10px;font-size: smaller; " icon="el-icon-s-operation"></el-button>

    <el-drawer
        title="mingchiuli"
        :visible.sync="drawer"
        :direction="direction"
        size="350px"
        :before-close="handleClose">

      <el-avatar :size="80" :src="avatar" style="margin-left: 40%"></el-avatar>

      <div style="margin-left: 39%; font-size: 18px; font-family: 'Kaiti SC',serif">百川東到海</div>
      <div style="margin-left: 39%; font-size: 18px; font-family: 'Kaiti SC',serif">何時復西歸</div>

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

import avatar from '../../public/WechatIMG7.jpeg'

export default {
  name: "Sider",
  data() {
    return {

      avatar: avatar,

      input: '',
      drawer: false,
      direction: 'ltr',
      data: [{
        label: '关于',
      }, {
        label: '日志',
      },{
        label: '归档',
        children: [{
          label: '2022'
        }
        ,{
            label: '2021'
          }
        ]
      }, {
        label: '简历'
      }, {
        label: '更新'
      }, {
        label: '代码'
      }
        , {
          label: 'mla'
        }
        , {
          label: '版权'
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
      switch (data.label) {
        case '2022':
          this.$router.push("/blogs/2022/1")
          this.drawer = false
          break
        case '2021':
          this.$router.push("/blogs/2021/1")
          this.drawer = false
          break
        case '日志':
          this.$router.push("/blogs/1")
          this.drawer = false
          break
        case '关于':
          this.$router.push("/")
          break
        case '简历':
          this.$router.push("/other/1")
          this.drawer = false
          break
        case 'mla':
          window.open().location.href = '/mla.html';
          this.drawer = false
          break
        case '更新':
          this.$router.push("/other/0")
          this.drawer = false
          break
        case '版权':
          window.open().location.href = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
          this.drawer = false
          break
        case '代码':
          window.open().location.href = '/_book/index.html';
          this.drawer = false
      }
    }
  },

  //同一个组件，路由改变时如果内容不变，如此解决
  watch: {
    $route(to,from){
      // created:{}里面的方法
    }

  }
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


