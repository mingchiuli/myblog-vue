<template>
  <div>
    <div v-if="flag">
      <div style="height: 45px">
        <Sider style="width: 0; margin-left: 10%;"></Sider>
      </div>
      <h1 style="text-align: center;">简历</h1>
      <hr>
      <div class="mbody">
        <div class="mIntro">
          <h2 style="text-align: center; font-size: x-large; font-family: 'Kaiti SC',serif">MingChiu Li</h2>
          <p class="mTitle">联系方式</p>
          <p class="mContent">Email：mingchiuli@163.com</p>
          <p class="mTitle">教育背景</p>
          <li class="mItem">2020.09 ~ 至今 暨南大学经济学院</li>
          <br class="mBr">
          <li class="mItem">2014.09 ~ 2018.6 西北农林科技大学葡萄酒学院，工学学士</li>
        </div>
      </div>
    </div>

    <div v-else-if="!flag">
      <div style="height: 45px">
        <Sider style="width: 0; margin-left: 10%;"></Sider>
      </div>
      <h1 style="text-align: center;">更新</h1>
      <hr>
      <div class="mbody">
        <div class="mIntro">
          <p class="mTitle">2022.2.26</p>
          <li class="mContent">动态路由权限添加</li>
          <br class="mBr"/>
          <p class="mTitle">2022.1.30</p>
          <li class="mContent">网址收藏检索</li>
          <br class="mBr"/>
          <p class="mTitle">2022.1.4</p>
          <li class="mContent">logback日志实时监控</li>
          <br class="mBr"/>
          <p class="mTitle">2021.12.31</p>
          <li class="mContent">对ws进行了重写</li>
          <br class="mBr"/>
          <p class="mTitle">2021.12.24</p>
          <li class="mContent">加入websocket</li>
          <br class="mBr"/>
          <p class="mTitle">2021.12.13</p>
          <li class="mContent">加入es和rabbitmq</li>
          <br class="mBr"/>
          <p class="mTitle">2021.11.20</p>
          <li class="mContent">添加文章结构目录，统一restful</li>
          <br class="mBr"/>
          <p class="mTitle">2021.11.18</p>
          <li class="mContent">侧边栏字体大小和间距调整</li>
          <br class="mBr"/>
          <p class="mTitle">2021.11.15</p>
          <li class="mContent">删除博客时服务器删除该博客上传的图片</li>
          <br class="mBr"/>
          <p class="mTitle">2021.11.13</p>
          <li class="mItem">初次上线</li>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import Footer from "@/components/Footer";
import Sider from "@/components/Sider";
export default {
  name: "Resume",
  components: {Sider, Footer},
  data() {
    return {
      flag: true
    }
  },

  created() {
    if (this.$route.params.flag === '0') {
      this.flag = false
    }
  },

  watch: {
    $route(to,from){
      // created:{}里面的方法

      this.flag = this.$route.params.flag !== '0';
    }

  }
}
</script>

<style scoped>


.mbody {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  min-height: 100px;
  padding: 20px 15px;
  margin-top: 3%;
  margin-left: 15%;
}


.mIntro {
  margin-top: 3%;
  font-size: larger;
  margin-bottom: 3.5%;
}

.mItem {
  text-align: center;
  font-size: medium;
}

.mBr {
  margin-bottom: 1%;
  margin-top: 1%;
}

.mTitle {
  margin-bottom: 2%;
  margin-top: 2%;
  font-size: larger;
  text-align: center;
}


.mContent {
  text-align: center;
  margin-bottom: 1%;
  margin-top: 1%;
  font-size: medium;
}



h2 {
  font-size: xx-large;
  margin-top: 2%;
  margin-bottom: 5%;
}


hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid;
  padding: 0;
  max-width: 20%;
  color: lightgray;
}


a {
  text-decoration: none;
  color: black;
  border-bottom: 1px dashed;
  font-size: medium;
}

h1 {
  font-size: xx-large;
  margin-top: 1%;
  margin-bottom: 3%;
}


</style>
