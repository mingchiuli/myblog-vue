<template>
  <div>
    <iframe src="http://157.7.135.42/books/"></iframe>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  name: "SystemBooks",
  components: {Footer}
}
</script>

<style scoped>
  iframe {
    border: medium none;
    /*width: 1500px;*/
    width: 100%;

    height: 580px;
  }
</style>
