<template>
  <div>
      <!--      width: 0解决flex Sider被拉伸的问题-->
    <Sider id="BPSider" @choose="setChoose"></Sider>

    <div class="m-content" v-if="year !== 0">
      <h1>Archive{{year}}({{count}})</h1>
      <hr>
    </div>


    <div class="m-content" v-else-if="title !== ''">
      <h1> {{ title }}</h1>
      <hr>
    </div>

    <div class="m-content" v-else>
      <h1> {{ choose }} </h1>
      <hr>
    </div>


    <LoginStatus></LoginStatus>

    <router-view @title="setTitle" @yearCount="setYearCount" @choose="setChoose"/>

    <Footer></Footer>

  </div>

</template>

<script>

import Sider from "@/components/Sider";
import Footer from "@/components/Footer";
import LoginStatus from "@/components/LoginStatus";

export default {
  name: "BlogParent",
  components: {Footer, Sider, LoginStatus},
  data() {
    return {
      title: '',
      year: 0,
      count: -1,
      choose: ''
    }
  },


  methods: {
    setTitle(title) {
      this.title = title
    },

    setYearCount(year, count) {
      this.year = year
      this.count = count
    },

    setChoose(choose) {
      this.year = 0
      this.choose = choose
    }
  },

  created() {
    if (localStorage.getItem("myToken")) {
      this.$store.state.hasLogin = true
    }
  },

  computed: {
    hasLogin: {
      get() {
        return this.$store.state.hasLogin
      },
      set(val) {
        this.$store.state.hasLogin = val
      }
    }
  },
}
</script>

<style scoped>

a {
  text-decoration: none;
  color: black;
  font-size: large;
}


.m-content {
  text-align: center;

}

hr {
  /*display: block;*/
  height: 1px;
  border: 0;
  border-top: 1px solid;
  padding: 0;
  max-width: 20%;
  color: lightgray;
}

h1 {
  font-size: xx-large;
  margin-top: 1%;
  margin-bottom: 3%;
}

#BPSider {
  /*float: left;*/
  margin-top: 10px;
  margin-left: 5%;
  /*margin-left: 50px;*/
}


</style>

