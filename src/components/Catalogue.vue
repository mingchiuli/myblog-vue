<template>
  <el-card class="toc-fixed" :body-style="{ padding: '5px' }"	>

    <div class="box">
      <div class="catalogueTitle">
        <div class="tocTitle">Catalogue</div>
        <el-button id="flushButton" style="margin-left: 20%; margin-top: 6%;" @click="tocAndCli">Flush</el-button>
      </div>
      <hr style="max-width: 90%;border: 0; border-top: 1px solid;color: lightgray;"/>

      <el-tree
          :data="toc"
          :props="props"
          highlight-current
          accordion
          :indent="10"
          node-key="id"
          @node-click="scrollToPosition"
          ref="menuTree">
      </el-tree>

    </div>
  </el-card>
</template>

<script>
let clipboard

import $ from "jquery";
import Clipboard from "clipboard";

export default {
  name: "Catalogue",
  data() {
    return {
      toc: [],

      catalogue: [],

      // isCatalog: true

    }
  },

  props: {
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        };
      }
    },
  },

  methods: {



    scrollToPosition(data) {

      let id = data.href

      const position = $(id).offset();
      position.top = position.top - 40;

      $("html,body").animate({ scrollTop: position.top }, 0);
    },



    tocAndCli() {

      this.$nextTick(() => {
        const aArr1 = $(
            ".v-note-wrapper a"
        ).toArray();

        let aArr = []

        aArr1.forEach(item => {
          if (item.id) {
            aArr.push(item)
          }
        })

        //有目录且目录长度大于2再显示目录
        if (aArr.length !== 0 && aArr.length !== 1) {


          //给数据赋值，保存元素的id和其距顶部的距离
          this.tocAndDist(aArr)

          let toc = [];
          aArr.forEach((item, index) => {

            let prop = $(item).parent().prop('nodeName');

            if (prop === 'H2') {
              let href = $(item).attr("id");
              let name = $(item).parent().text();

              let children = this.getChildren(aArr, item, index)
              toc.push({
                id: href.substring(href.lastIndexOf("_") + 1),
                href: "#" + href,
                name,
                prop,
                children
              });
            }
          });
          this.toc = toc
          this.$emit("isCatalog", true)
        }
      });

      clipboard = new Clipboard(".copy-btn");

      this.$nextTick(() => {
        // 复制成功失败的提示
        clipboard.on("success", () => {
          this.$message.success("复制成功");
        });
        clipboard.on("error", () => {
          this.$message.error("复制失败");
        });
      });
    },


    tocAndDist(arr) {
      arr.forEach(item => {

        if ($(item).attr("id")) {

          let id = item.id.substring(item.id.lastIndexOf("_") + 1)

          let dist = $('#' + item.id).offset().top;

          this.catalogue.push({id, dist})
        }

      })
    },

    getChildren(aArr, item, index) {

      let out = []

      if (index === aArr.length - 1) {
        return []
      }

      let nodeName = $(aArr[index]).parent().prop('nodeName')

      let level = parseInt(nodeName.substring(1, 2).charAt(0))

      if ($(aArr[index + 1]).parent().prop('nodeName') === nodeName) {
        return []
      }

      //for循环作用，为index构建孩子节点，再遇到与index相等或更大的层级直接break
      for (let i = index + 1; i < aArr.length; i++) {

        let name = $(aArr[i]).parent().prop('nodeName')

        if (level + 1 === parseInt(name.substring(1, 2))) {

          //构建孩子
          let href = $(aArr[i]).attr("id");
          let name = $(aArr[i]).parent().text();
          let children = this.getChildren(aArr, aArr[i], i)

          out.push({
            //lastIndexOf是因为有些标签有多个_，取最后为id
            id: href.substring(href.lastIndexOf("_") + 1),
            href: "#" + href,
            name,
            children
          })
        } else if (level >= parseInt(name.substring(1, 2))) {
          break;
        }
      //如果是2，2，2，就不构建孩子
      }
      return out
    },


    roll() {
      let scrolled = document.documentElement.scrollTop || document.body.scrollTop

      let temp

      this.catalogue.forEach(item => {
        let dist = scrolled - item.dist
        if (dist > -41) {
          temp = item
        }
      })


      try {

        let nodes = this.$refs.menuTree.store._getAllNodes();

        for (let i in nodes) {
          if (nodes[i].data.id === temp.id) {
            nodes[i].expanded = true

            this.$refs.menuTree.setCurrentKey(nodes[i].data.id)

            this.expand(nodes[i])
          } else {
            nodes[i].expanded = false
          }
        }
      } catch (e) {

      }
    },

    expand(node) {
      if (node && node.parent) {
        node.parent.expanded = true
      }
      //展开他的所有父节点
      if (node.parent)
        this.expand(node.parent)
    }
  },

  mounted() {
    window.addEventListener('scroll', this.roll)
  },

  destroyed() {
    clipboard.destroy();
  }
}
</script>

<style lang="less">

.tocTitle {
  margin-left: 5%;
  font-size: 18px;
  margin-bottom: 1%;
  margin-top: 6%;
}

.toc-fixed {
  position: fixed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 13%;
  width: 20%;
  right: 1%;
  top: 10px;
  max-height: 100%;
  .el-tree-node__content {
  height: 26px !important;
  font-size: xx-large;
  overflow-x: auto;
  overflow-y: auto;
}
}

.catalogueTitle {
  display: flex;
  flex-direction: row;
}


#flushButton {
  //color: #FFF;
  //background-color: #1E90FF;
  //border-color: #1E90FF;
  height: 20px;
  width: 40px;
  line-height: 18px;
  padding: 0 0;
  //font-weight: 200;
  //padding: 0 20px;
}


</style>
