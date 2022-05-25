<template>
    <div>

      <div>
        <h1 style="text-align: center;">路由错误</h1>
        <hr>
        <div class="mbody">
          <div class="mIntro">
            <h2 style="text-align: center; font-size: x-large; font-family: 'Kaiti SC',serif">The page at {{ url }} was not found. Feel confused? </h2>
            <p class="mTitle">Please go ahead and leave a message below to notify me. </p>
            <p class="mTitle">Email：mingchiuli@163.com</p>
            <p class="mTitle">It will be great if you could tell me the URL of the page and where/how you got this URL. Thanks!</p>
            <p><img src="https://slides.yihui.org/gif/elevator.gif" alt="404 not found" /></p>
          </div>
        </div>
      </div>

      <Comment></Comment>
      <Footer></Footer>
    </div>
</template>

<script>

import Comment from "@/components/Comment";
import Footer from "@/components/Footer";

export default {
  name: "NotFound",
  components: {Footer, Comment},
  data() {
    return {
      url: ''
    }

  },

  created() {
    this.url = location.href
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
  text-align: center;
}


.mIntro {
  margin-top: 3%;
  font-size: larger;
  margin-bottom: 3.5%;
}

.mTitle {
  margin-bottom: 2%;
  margin-top: 2%;
  font-size: larger;
  text-align: center;
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
