<template>
  <div style="text-align: center">
    <p style="font-weight: bolder">访客访问记录</p>
    <Map></Map>
    <p style="font-weight: bolder">点击图片查看详情</p>
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
