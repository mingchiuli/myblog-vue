<template>
  <div>
    <Sider style="width: 0; margin-left: 10%;"></Sider>
    <router-link style="font-size: medium;margin-left: 78%; margin-bottom: 5px" :to="{name: 'Blogs', params: {currentPage : 1}}">进入日志</router-link>
    <div class="mbody">
      <div class="mIntro">
        爱是恒久忍耐 又有恩慈 爱是不嫉妒
        <br>
        Love is patient; love is kind
        <br>
        爱是不自夸 不张狂 不做害羞的事
        <br>
        love is not envious or boastful or arrogant or rude
        <br>
        不求自己的益处 不轻易发怒
        <br>
        It does not insist on its own way; it is not irritable or resentful
        <br>
        不计算人的恶 不喜欢不义 只喜欢真理
        <br>
        it does not rejoice in wrongdoing, but rejoices in the truth
        <br>
        凡事包容 凡事相信 凡事盼望 凡事忍耐
        <br>
        It bears all things, believes all things, hopes all things, endures all things
        <br>
        爱是永不止息
        <br>
        Love never ends
        <br>
        <p style="text-align: right">新约<br>哥林多前书<br>第十三章<br>第四节～第八节</p>
      </div>
    </div>
    <div>
      <p style="text-align: center">
        <img src="../../public/background.png" class="mImg" alt="">
      </p>
      <li style="text-align: center">Secret Garden《Winter Poem》</li>

      <p style="text-align: center">
        <img style="width: 50%; height: 30%" src="../../public/746311-20191023220441012-897312309.jpg" class="mImg" alt="">
      </p>
      <li style="text-align: center">博客园抠的《不知道从哪来的图片》</li>
    </div>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
import Sider from "@/components/Sider";
export default {
  name: "Intro",
  components: {Sider, Footer},
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
