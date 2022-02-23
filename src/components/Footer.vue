<template>
  <div class="footer">
    <hr>
    <div class="copyright">&copy; <a href="/"> MingChiu Li </a> 2021-2022 </div>
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid;
  margin: 1% auto;
  padding: 0;
  max-width: 20%;
  color: lightgray;

}

.copyright {
  text-align: center;
  font-size: 17px;
  margin-top: 3%;
}



a {
  text-decoration: none;
  color: black;
  font-family: "Brush Script MT",serif;
  font-size: 20px;
}





</style>
