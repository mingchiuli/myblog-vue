<template>
  <div id="SI">
    <p>Visitor access records</p>
    <Map></Map>
    <p>Click on the picture to view the details</p>
    <Footer></Footer>
  </div>
</template>

<script>
import Map from "@/components/Map";
import Footer from "@/components/Footer";
export default {
  name: "SystemIndex",
  components: {Footer, Map}
}
</script>

<style scoped>
p {
  font-weight: bolder;
}

#SI {
  text-align: center;
}
</style>
