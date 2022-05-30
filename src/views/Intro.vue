<template>
  <div>
<!--    <Sider style="width: 0; margin-left: 10%;"></Sider>-->
    <div style="margin-top: 50px"></div>
    <div style="margin-left: 78%">
      <router-link style="font-size: large; margin-bottom: 5px;" :to="{name: 'Blogs', params: {currentPage : 1}}">Step into</router-link>
    </div>
    <div class="mbody">
      <div class="mIntro">
        Love is patient
        <br>
        Love is kind
        <br>
        Love is not envious or boastful or arrogant or rude
        <br>
        It does not insist on its own way
        <br>
        It is not irritable or resentful
        <br>
        It does not rejoice in wrongdoing, but rejoices in the truth
        <br>
        It bears all things, believes all things, hopes all things, endures all things
        <br>
        Love never ends
        <br>
        <p style="text-align: right">The Teachings and Works of Jesus<br>1 Corinthians<br>Chapter 13</p>
      </div>
    </div>
    <div>
      <p style="text-align: center">
        <img src="http://81.68.192.120:8081/upload/img/20211118224937/aecd9f6e-bbef-43af-9540-ebac1c0c2132_winterpoem.jpg" class="mImg" alt="">
      </p>
      <li style="text-align: center">Secret Garden《Winter Poem》</li>

    </div>
    <Comment></Comment>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
import Sider from "@/components/Sider";
import Comment from "@/components/Comment";
export default {
  name: "Intro",
  components: {Comment, Sider, Footer},
}
</script>

<style scoped>
.mbody {
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  margin-left: 15%;
  min-height: 100px;
  padding: 2% 1.5%;
  margin-top: 0.5%;
}

.mImg {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 25%;
  min-height: 50px;
  padding: 5px 4px;
  margin-top: 3.5%;
}

.mIntro {
  font-family: "Kaiti SC",serif;
  margin-top: 3%;
  font-size: larger;
  margin-bottom: 3.5%;
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
  margin: 5% auto;
  padding: 0;
  max-width: 30%;
  color: lightgray;
}

a {
  text-decoration: none;
  color: black;
  border-bottom: 1px dashed;
  font-size: medium;
}




</style>
