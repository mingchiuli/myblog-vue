<template>
  <div style="text-align: center">
    <p style="font-weight: bolder">Visitor access records</p>
    <Map></Map>
    <p style="font-weight: bolder">Click on the picture to view the details</p>
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

</style>
