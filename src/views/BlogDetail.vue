<template>
  <div>

    <div class="m-content">
      <Catalogue :props="defaultProps" ref="toc" v-show="catalog" v-if="isPC" @isCatalog="showCatalog"></Catalogue>

      <EditStatus v-if="hasLogin" :blog="blog"></EditStatus>

      <div v-loading="loading" id="editor">
        <!--使用mavon-editor预览功能-->
        <mavon-editor class="mavon-editor" v-html="blog.content" :subfield="false"
                      :editable="false"
                      default-open="preview"
                      :navigation="true" :toolbars-flag="false" previewBackground="#ffffff" code-style="androidstudio" :scrollStyle="false">
        </mavon-editor>
      </div>

      <BackTop></BackTop>
      <Comment id="editor"></Comment>
    </div>

  </div>
</template>

<script>

import EditStatus from "@/components/EditStatus";
let clipboard

import Catalogue from "@/components/Catalogue";
import LoginStatus from "@/components/LoginStatus";
import Sider from "@/components/Sider";
import Comment from "@/components/Comment";
import { markdown } from "@/util/markdown";
import BackTop from "@/components/BackTop";
import Footer from "@/components/Footer";


export default {
  name: "BlogDetail.vue",
  components: {Footer, BackTop, EditStatus, Catalogue, Comment, Sider, LoginStatus},
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


  methods: {

    showCatalog(val1) {
      this.catalog = val1
    },

    isPCOrMobile() {
      this.flag =  navigator.userAgent.match(/(phone|pod|iPhone|iPod|ios|Android|Moblie|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowerNG|WebOS|Symbian|Windows Phone)/i);
      if (this.flag === null) {
        this.isPC = true;
      }
      return this.flag === null
    },


    createdCommon(res) {
      const blog = res.data.data
      this.blog.id = blog.id
      this.blog.title = blog.title
      document.title = blog.title
      this.$emit("title", blog.title)

      this.blog.content = markdown(this.$mavonEditor.mavonEditor, blog.content)
    },
  },

  created() {
    this.isPCOrMobile()

    this.$emit("yearCount", 0, -1)

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
        if (this.isPC) {
          this.$refs.toc.setTimeoutTocAndCli()
        }
      })

    } else if (this.$route.query.token) {

      this.loading = true
      const blogId = this.$route.params.blogId
      const token = this.$route.query.token

      this.$axios.get('/blogToken/' + blogId + '/' + token).then(res => {

        this.createdCommon(res)
        this.loading = false
        if (this.isPC) {
          this.$refs.toc.setTimeoutTocAndCli()
        }
      })

    } else {

      this.loading = true
      const blogId = this.$route.params.blogId

      this.$axios.get('/blog/' + blogId).then(res => {

        this.createdCommon(res)
        this.loading = false
        if (this.isPC) {
          this.$refs.toc.setTimeoutTocAndCli()
        }
      })
    }

    setTimeout(() => {
      let ele = document.querySelector("#editor");

      if (this.isPCOrMobile()) {
        ele.style.width = '50%'
      } else {
        ele.style.width = '350px'
      }
    }, 100)
  },
}
</script>

<style lang="less">

#editor {
  margin: auto;
  width: 50%
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
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAdCAYAAABcz8ldAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAhgSURBVGhD7Zp7bBTHHcdn33t7vvOdzy+ITVKDU0xIKG2ABCPTRCCaUiEVKWoqRJuASAhCitRCVKSoalFUKZBiSmmFRRJKRUnUtIpo+aNqGgwoOCmuFUIRzxjwE4zte+97drYzztji8HPvtkit/PnH+n1397Tz+83vN/PbMZhmmmmm+d+BoX8n5diihcGqgFQf5vk6BMAskWUlw3GyFnIvtqWSf91w7mKC3npfOLX7wYeiIa6BBWCOLLFRF2NB0JvIOP/80YG+k2ev6S699b/OzOfKBW5l5KsgyC4DCFQDnpEAdE1goc/dlNPc/Up7P711UiYNSMuyxeUzZPnHgGHWh5XADEkSAcdiN+AnEXIBhBComgFU0/xQR+jnj51sOUMf9Z0NKyL8S9+JPBEN8zuCMrsqGOA5QWAAyzLAxe53HBeYFgJp1c5Cx33nyIfpV3e+22/Sx32nev/sMCgVnmM4bjOniAtZWQAsz315EfsGQQc4hgWcjHkCmOj1rheuNn95cXwmDMiVp5etC/D8m5FwUWVQUYYGPh6mZYFUOgsGVa1pXvOZzVT2jRuH54RM230jEuI3RcIiL4l4UkxAJmuD/riVsqD7ct2m9nep7BtVTbVfZ0uE/UIk+CQflAHDjf8+Lg6MldYATGpH3c/Ul7p3dWXppVGM6eElJSHmnQWPbSlRlN1lJcUBjqNRnwJZVQO3B5P/uq5rK1d90pakckFcaKp5UJHY92JR8YlwkUDVySEZfGfQdO7E7Z8s2HL9TSoXTPXRud9nA8IBqSwcZgWeqpPj6BYw7yTbXBN9q2v9lQEq5zBmWA8vWLCptCi4tzwW8RQMQlFQATPLSh6vCSh/plJBkMyQBHZfWYnkKRgEktEVpTJXERN2Xzo4ex2VC6K6qXYpF5b3ypVRT8EgcAERSJXRbwCBOTFzXblM5RxGBaRt+ZPYA+LO0mgxz5K1Ig+UgAzKIuGnz39z6S+olDeaibaXRsU1RUFvgx+GwTWgPCaDgMw2XXpr9gwq50XV0bkxJiYeEiNF5cwE5XsiOEkAUkXkUW51SSOVchjl8WKef604XFSRbzCGCYeCoESStv/p8QU1VPIM3knNDynctnBRfsEYhgSlNCIGgQv2UCkvGIHZgteMh1nBW9W4F16RAM6yDVV7amZTaYQcr59cuuhhWRTWBvAMLxQGeyFSHOLnh0MvUskz5RF+fbRYDEy0mZgqQYUHOLhr//b6rGoqeaLqQG0pw3PrBbyA+4EQUkRmhvgqNUfICUipKK4OKUqIJVPKB0jpEhjmWWp64jdbKmVZZNYogcJm493gsifOqhDyeh9GYR/FM7sW+DA5CKR0MSK3tvKZkpwB5gRE4tjFEr7RL0iWBGV51vHFCyupNGWWPqLgnoer9mtyEGSJAzwLllDTGzyznDjRN/CwOFkoFb4bm0eVIXICgpvdGoEvrF7fC89zfLkkeV5HbOhWiTwTpKYvCAJLGshRdXtKMKAWlyxq+MPQLk1h66g5RE5ABJYNFrqY3wvJklJRUKg5ZWLFXIA86yek2uDOPkBNb3CM5Pf7DL2QyIrUGiLH+xC5Bmmm/ARnHUhC6PnzxWDK0RH5HuIjZGy27erU9AZ0dTIWXyG+NpBBrSFySxZw220IqeUPFoS6jVAPNadM7yDsgNB1qOkLuAziMYIb1PQGA75wIaKGPyAb+9oF16g5RE5ALIQ+tSyLWoWDEAK6aXW3JlK9VJoyx1oyvVkNdvo5KXXDAVkdnaKmNwx0xjH98w3JNmTCm+Bc9hKVhsgJSI9pvp9Vdd++jmq6AXB2/HHrhcs5aTkVDv0DFzoHvKdq/mQsKX/4t7KJLDpOJW+IbAvMGoMkxfwAWZB8DT7W1diTE+WcgKz6pK1bs6z3daPwmJDsSKt6ZsCyjlLJMz0DsDGZ8SdlDROBjOb8YeWOjptU8kTXusuaazu7oJrfEnQvdkpVcUn6PTVHyAkIIW7br/Unklni0EJIZ1WgGsauZR+fvUglz6zY0dGfVp09ybRNlfwgi3k8YSbvJJ29VMoLt9v6rZVQL7hOYUubndHJGclBtzn1byqNMCogi09/2nFb01/oj+f/5TyjauBOKtPcZ1r7qZQ3f2lRfxZPWi2anp8TSDAGExZMa2jr8u03L1M5L7q3Xc+iAeuHRl/ScvPcjSLDBnZS/cjtNHd2v3171Ewbs9N5q7Pn4otVMx3btBsCsoRbk1FxG5dMVgMDqfTpXl1/tuFMa5zKefPROdX59qLQBwLnNog8Wy1OcjB1N+QEsW/QsFNZuO35Xb1v98QLX4/Sx+O3wqujrQ6013ABUWI8+AaqBjAH01+ghL22+5X2PirnMG7r+esbnae/V1neauvGSoHjigTcVU7UGFm2DeK4ttxKpQ+mLPvl+o/PjnkAkw9HTqSMmVHhyAMx9iFcSh/BHTfLceO/C8mKjApBf9zszGhoY92m9sN+BGOY9AeD7eGniv8OTaOB4dgyTsQd9wS+IQu4lciYdkI7CLrNH3Rvbb9FL41i0tbzVP2iWJkobpN5fmM4IJfJskTP1Bk8A9HQmbpmGDBrWqdVCN/Yd7PjxKGOXn+bmbto3feVVcVB9qehIL8EJy8nChwgr0O2xxBnhGU5eP2CfYbl/m4gBRsbtneMORP9oGpjpcCsiKzHHfdOPiQ/wMniyFEu2dbiTQCAeN/vavC466BGYLttXc9fmXBXMGlAhiHHur+sq6uPiUI9z7CVHMPwBnLSuuN8FuC48/Oaz1ylt94XfrW5ouyprwWfYRkwNyCyYYjwkBHows1fa+tV/fzGxlv39b9gqvfPmQ+i/HK8KlcBjhHwfl8HEHyOd1JnuzZd66S3TTPNNNP8/wDAfwDG7G0m9LKBpwAAAABJRU5ErkJggg==)
  10px center no-repeat;
  background-size: contain;
  position: absolute;
  top: 10px;
  left: 0;
  box-sizing: border-box;
  z-index: 1;
}

.mavon-editor {
  padding: 25px;
}

</style>
