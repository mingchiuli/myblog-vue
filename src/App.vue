<template>
  <div id="app">
    <router-view/>
    <Footer class="footer" style="padding: 40px"></Footer>
  </div>
</template>

<style>
  #app, html, body {
    height: 100%;
    margin: 0;
    border: 0;
    padding: 0;
  }


</style>
<script>
import Footer from "@/components/Footer";
export default {
  components: {Footer}
}
</script>
