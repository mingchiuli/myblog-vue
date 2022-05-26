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

.footer {
  margin-top: 4%;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid;
  margin-top: 4%;
  margin-bottom: 3%;
  padding: 0;
  max-width: 20%;
  color: lightgray;

}

.copyright {
  height: 50px;
  text-align: center;
  font-size: 17px;
}



a {
  text-decoration: none;
  color: black;
  font-family: "Brush Script MT",serif;
  font-size: 20px;
}

</style>
