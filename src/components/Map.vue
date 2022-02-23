<template>
  <div id="map"></div>
</template>


<script>

export default {
  name: "Map",
  methods: {
    init () {
      // 建立脚本以及属性
      const clustrmaps = document.createElement('script');
      clustrmaps.type = 'text/javascript';
      clustrmaps.id = 'clustrmaps';
      clustrmaps.src = '//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=800&t=n&d=ar4DoR6oA5WqQNwFUItzONV-k0aTuIMK3CCTVl9Onyg';

      // comment 是要插入评论的地方
      document.getElementById('map').appendChild(clustrmaps);

    }
  },
  mounted: function() {
    // 每次挂载时候，进行初始化
    this.init()
  }
}
</script>

<style scoped>

</style>
