<template>
  <div>
    <div id="head">
      <router-link id="link" :to="{name: 'Blogs', params: {currentPage : 1}}">Step into</router-link>
    </div>
    <div class="mBody">
      <div class="mIntro">
        Suppose one of you has a hundred sheep and loses one of them. Doesn't he leave the ninety-nine in the open country and go after the lost sheep until he finds it? And when he finds it, he joyfully puts it on his shoulders and goes home. Then he calls his friends and neighbors together and says, 'Rejoice with me; I have found my lost sheep.' I tell you that in the same way there will be more rejoicing in heaven over one sinner who repents than over ninety-nine righteous persons who do not need to repent.
        <p id="bottom">The Teachings and Works of Jesus<br>Gospel of Luke<br>Chapter 15</p>
      </div>
    </div>
    <div id="painting">
      <p>
        <img src="http://81.68.192.120:8081/upload/img/20211118224937/aecd9f6e-bbef-43af-9540-ebac1c0c2132_winterpoem.jpg" class="mImg" alt="">
      </p>
      <li>Secret Garden《Winter Poem》</li>

    </div>
    <Comment></Comment>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
import Comment from "@/components/Comment";
export default {
  name: "Intro",
  components: {Comment, Footer},
}
</script>

<style scoped>
.mBody {
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  margin: 0.5% auto;
  padding: 2% 1.5%;
}

.mImg {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 20%;
  min-height: 50px;
  padding: 5px 4px;
  margin-top: 3.5%;
}

.mIntro {
  /*font-family: "Kaiti SC",serif;*/
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

#painting * {
  text-align: center;
}

#head {
  margin-left: 78%;
  margin-top: 50px;
}

#link {
  font-size: large;
  margin-bottom: 5px;
}

#bottom {
  text-align: right;
}


</style>
