<template>
  <div>
    <div>
      <Sider style="width: 0; margin-left: 10%;"></Sider>
      <h1 style="text-align: center;font-family: 'Kaiti SC',serif"> {{ blog.title }}</h1>
      <hr/>
      <LoginStatus></LoginStatus>
    </div>

    <el-card class="toc-fixed" v-if="catalog & isPC" :body-style="{ padding: '5px' }"	>

      <div class="box">
        <div class="tocTitle">目录</div>
        <hr style="max-width: 90%;border: 0; border-top: 1px solid;color: lightgray;"/>

        <el-tree
            :data="toc"
            :props="defaultProps"
            highlight-current
            accordion
            :indent="10"
            node-key="id"
            @node-click="scrollToPosition"
            ref="menuTree">
        </el-tree>

      </div>
    </el-card>

    <div>
      <div class="status" v-if="hasLogin">
        <el-link icon="el-icon-edit">
          <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" style="font-size: medium; color: green">
            <!--        编辑-->
            <el-button type="text" style="font-size: medium; color: limegreen">编辑</el-button>

          </router-link>
        </el-link>
        <el-divider class="el-div" direction="vertical"></el-divider>
        <el-divider class="el-div" direction="vertical"></el-divider>
        <el-link icon="el-icon-delete">
          <el-button type="text" @click="deleteBlog" style="font-size: medium; color: indianred">删除</el-button>
        </el-link>
      </div>

      <div>
        <div class="content" v-loading="loading">
<!--                使用mavon-editor预览功能-->
          <mavon-editor v-html="blog.content" :subfield="false"
                        :editable="false"
                        default-open="preview"
                        :navigation="true" :toolbars-flag="false" previewBackground="#ffffff" code-style="androidstudio" :scrollStyle="false" style="padding: 25px">
          </mavon-editor>
        </div>
      </div>

    </div>

    <el-backtop>
      <div
          style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >
        UP
      </div>
    </el-backtop>

    <Utterances style="width: inherit"></Utterances>

  </div>
</template>

<script>

let clipboard

import Footer from "@/components/Footer";
import LoginStatus from "@/components/LoginStatus";
import Sider from "@/components/Sider";
import $ from "jquery";
import Utterances from "@/components/Utterances";
import { markdown } from "@/util/markdown";
import Clipboard from "clipboard";
import mavonEditor from "mavon-editor";


export default {
  name: "BlogDetail.vue",
  components: {Utterances, Comment, Sider, Footer, LoginStatus},
  data() {
    return {
      blog: {
        id: "",
        title: "加载中...",
        content: ""
      },

      currentPage: 1,
      year: 0,
      toc: [],
      catalog: false,
      isPC: false,
      flag: [],
      loading: false,

      catalogue: [],

      defaultProps: {
        children: "children",
        label: "name"
      }
    }
  },


  methods: {

    handleNodeClick(data) {
      console.log(data);
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
            this.catalog = true
          }
        });

        this.toc = toc
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
        } else if (level < parseInt(name.substring(1, 2)) - 1) {
          continue
        } else {
          break
        }

      }

      return out
    },

    isPCorMobile() {
      this.flag =  navigator.userAgent.match(/(phone|pod|iPhone|iPod|ios|Android|Moblie|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowerNG|WebOS|Symbian|Windows Phone)/i);
      if (this.flag === null) {
        this.isPC = true;
      }
    },


    scrollToPosition(data) {

      let id = data.href

      const position = $(id).offset();
      position.top = position.top - 40;

      $("html,body").animate({ scrollTop: position.top }, 0);
    },

    deleteBlog() {
      const ids = []
      ids.push(this.blog.id)
      this.$confirm('是否删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/deleteBlogs', ids, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
          this.$router.push('/blogs/1')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    createdCommon(res) {
      const blog = res.data.data
      this.blog.id = blog.id
      this.blog.title = blog.title
      document.title = blog.title

      this.blog.content = markdown(mavonEditor.mavonEditor, blog.content)
    },

    roll() {
      let scrolled = document.documentElement.scrollTop || document.body.scrollTop

      let temp

      this.catalogue.forEach(item => {
        let dist = scrolled - item.dist
        if (dist > -41) {
          temp = item
          return
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
    this.isPCorMobile()

    window.addEventListener('scroll', this.roll)
  },
  created() {

    if (JSON.parse(localStorage.getItem("myUserInfo")) && JSON.parse(localStorage.getItem("myUserInfo")).role === 'admin') {

      this.$store.state.hasLogin = true
      this.loading = true
      const blogId = this.$route.params.blogId
      this.$axios.get('/blogAuthorized/' + blogId, {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {

        this.createdCommon(res)

        this.loading = false

        this.tocAndCli()
      })


    } else if (this.$route.query.token) {

      this.loading = true
      const _this = this
      const blogId = this.$route.params.blogId
      const token = this.$route.query.token

      this.$axios.get('/blogToken/' + blogId + '/' + token).then(res => {

        this.createdCommon(res)

        _this.loading = false

        this.tocAndCli()

      })

    } else {

      this.loading = true
      const _this = this
      const blogId = this.$route.params.blogId

      this.$axios.get('/blog/' + blogId).then(res => {

        this.createdCommon(res)

        _this.loading = false

        this.tocAndCli()

      })
    }
  },

  computed: {
    hasLogin: {
      get() {
        return this.$store.state.hasLogin
      },
      set(val) {
        this.$store.state.hasLogin = val
      }
    }
  },

  destroyed() {
    clipboard.destroy();
  }
}
</script>

<style lang="less">

.content {
  text-align: center;
  max-width: 70%;
  margin-left: 15%;
  font-family: Source Han SC,serif;
}

.status {
  margin-left: 15%;
}


a {
  text-decoration: none;
  color: black;
  font-size: small;
}

.fixedButton {
  position: fixed;
  bottom: 3%;
  font-size: smaller;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid;
  padding: 0;
  max-width: 20%;
  color: lightgray;
}

h1 {
  font-size: xx-large;
  margin-top: 1%;
  margin-bottom: 3%;
}

//使用v-html填充内容以后，这个样式就不用变更了
div.v-note-wrapper .v-note-panel .v-note-navigation-wrapper.transition {
  /*display: none;*/
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



.toc {
  width: 100%;
  overflow-y: auto;
  word-break: break-all;
  padding: 0.2rem 0 0.2rem 0.2rem;
}

.tocTitle {
  margin-left: 5%;
  font-size: 18px;
  margin-bottom: 1%;
  margin-top: 6%;
}

.toca {
  display: inline-block;
  color: #2196f3;
  font-size: 16px;
  margin-left: 5.5%;
  cursor: pointer;
  padding: 2% 0;
}

.utterances {
  max-width: 70%;
}


pre.hljs {
  padding: 40px 2px 12px 40px !important;
  border-radius: 5px !important;
  position: relative;
  font-size: 14px !important;
  line-height: 22px !important;
  overflow: hidden !important;
  code {
    display: block !important;
    margin: 0 10px !important;
    overflow-x: auto !important;
    &::-webkit-scrollbar {
      z-index: 11;
      width: 6px;
    }
    &::-webkit-scrollbar:horizontal {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      width: 6px;
      background: #666;
    }
    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background: #1e1e1e;
    }
    &::-webkit-scrollbar-track-piece {
      background: #1e1e1e;
      width: 6px;
    }
  }
  // 行号样式
  .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 40px;
    bottom: 12px;
    left: 0;
    font-size: 100%;
    width: 40px;
    text-align: center;
    letter-spacing: -1px;
    border-right: 1px solid rgba(0, 0, 0, 0.66);
    user-select: none;
    counter-reset: linenumber;
    span {
      pointer-events: none;
      display: block;
      counter-increment: linenumber;
      &:before {
        content: counter(linenumber);
        color: #999;
        display: block;
        text-align: center;
      }
    }
  }
  // 代码语言
  b.name {
    position: absolute;
    top: 4px;
    right: 60px;
    z-index: 10;
    color: #999;
    pointer-events: none;
  }
  // 复制按钮样式
  .copy-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 10;
    color: #333;
    cursor: pointer;
    border: 0;
    border-radius: 2px;
    outline: none;
  }
}

.markdown-body pre.hljs {
  background: #23241f;
}

// 漂亮的title
pre.hljs::after {
  height: 15px;
  width: 100px;
  margin-bottom: -7px;
  border-radius: 5px 5px 0 0;
  display: block;
  content: "";
  background: url(data:image/png;base64,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)
  10px center no-repeat;
  background-size: contain;
  position: absolute;
  top: 10px;
  left: 0;
  box-sizing: border-box;
  z-index: 1;
}

</style>
