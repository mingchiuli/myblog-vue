<template>
  <div>
    <div class="myItem">

      <el-autocomplete
          id="BAutocomplete"
          v-model="input"
          @keyup.enter.native="searchKeyword"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearchAsync"
          placeholder="Keyword"
          @select="handleSelect"
          :popper-append-to-body="false"
          clearable>
        <template #default="{ item }">
          <div class="autocomplete-choose-name" v-html="item.value"></div>
        </template>
      </el-autocomplete>

      <el-button @click="searchKeyword" type="success" plain icon="el-icon-search"></el-button>
    </div>

    <div class="block" v-loading="skipLoading">

      <el-timeline>
        <el-timeline-item v-if="loading" v-for="i in 5" :timestamp="'1900-01-01'" placement="top" color="#0bbd87">
          <el-card class="el-card">
            <el-skeleton :loading="loading" animated :count="1">
              <template slot="template">
                <el-skeleton-item
                    variant="image"
                    style="width: 100%;height: 202px"
                />
                <div style="padding: 14px;">
                  <el-skeleton-item variant="h3" style="width: 50%;" />
                  <div
                      style="display: flex; align-items: center; margin-top: 16px; height: 16px;"
                  >
                    <el-skeleton-item variant="text" style="margin-right: 16px;" />
                    <el-skeleton-item variant="text" style="width: 30%;" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </el-card>
        </el-timeline-item>
      </el-timeline>


      <el-timeline>
        <el-timeline-item :timestamp="blog.created" placement="top" v-for="blog in blogs" color="#0bbd87">
          <p v-if="blog.score !== undefined">{{"Search Scores：" + blog.score}}</p>
          <el-card class="el-card">
            <img :src="blog.link ? blog.link : 'http://81.68.192.120:30081/upload/img/20211118224937/5f1c825e-9060-40b3-a66a-33f35a6104d3_ScreenShot2022-08-01at2.29.34PM.png'" class="image" alt="">
            <h4>
              <el-link style="color: black" type="info" plain @click="blogStatus(blog.id)">{{blog.title}}</el-link>
            </h4>
            <p>{{blog.description}}</p>
            <p v-if="blog.highlight !== undefined" v-html="blog.highlight"></p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-pagination class="mPage"
                     background
                     layout="prev, pager, next"
                     :current-page="parseInt(currentPage)"
                     :page-size="pageSize"
                     :total="total"
                     @current-change=pageSelect>
      </el-pagination>

    </div>
  </div>
</template>

<script>
  import Footer from "@/components/Footer";
  import Sider from "@/components/Sider";
  import LoginStatus from "@/components/LoginStatus";
  import $ from "jquery";

  export default {
    name: "Blogs.vue",
    components: {Footer, Sider, LoginStatus},
    data() {
      return {
        input: '',
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5,
        year: 0,
        count: 0,
        loading: false,
        skipLoading: false,
        searchAbstract: [],
        timeout: null,
        isPC: false
      }
    },
    methods: {

      isPCOrMobile() {
        this.flag =  navigator.userAgent.match(/(phone|pod|iPhone|iPod|ios|Android|Moblie|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowerNG|WebOS|Symbian|Windows Phone)/i);
        if (this.flag === null) {
          this.isPC = true;
        }
        return this.flag === null
      },

      changeStyle(status, className) {
        let dom = document.querySelectorAll(className);
        dom[0].style.display = status;
      },

      blogsCommon(res) {
        this.blogs = res.data.data.records
        for (let i = 0; i < this.blogs.length; i++) {
          this.blogs[i].created = this.blogs[i].created.substring(0, 10)
        }

        this.currentPage = res.data.data.current

        this.total = res.data.data.total
        this.pageSize = res.data.data.size
      },

      querySearchAsyncCommon(res, cb) {
        let raw = res.data.data.records
        let results = this.transSearchContent(raw)
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 300);
      },

      querySearchAsync(input, cb) {
        if (this.year !== 0) {
          this.$axios.get('/searchByYear/0/' + 1 + '/' + this.year + '?keyword=' + input).then(res => {
            this.querySearchAsyncCommon(res, cb)
          })
        } else {
          this.$axios.get('/search/0/' + 1 + '?keyword=' + input).then(res => {
            this.querySearchAsyncCommon(res, cb)
          })
        }
      },

      transSearchContent(array) {

        let results = []

        array.forEach((item) => {
          let temp = {"value": item.highlight, "id": item.id}
          results.push(temp)
        })

        return results
      },

      handleSelect(item) {
        this.$router.push('/public/blog/' + item.id)
      },

      blogStatus(id) {
        let str = localStorage.getItem("myUserInfo")
        let role = 'anonymous';

        if (str !== null) {
          role = JSON.parse(str).role
        }

        if (role === 'admin') {
          this.$router.push({name: 'BlogDetail', params: {blogId: id}})
        } else {
          this.skipLoading = true
          this.$axios.get('/blogStatus/' + id).then(res => {
            const status = res.data.data
            this.skipLoading = false
            if (status === 1) {

              this.$prompt('Please input the password', 'Prompt', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
              }).then(({ value }) => {
                this.$axios.get('/blogToken/' + id + '/' + value).then(res => {
                  this.$router.push('/public/blog/' + id + '?token=' + value)
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: 'Contact with me to get the password'
                });
              });

            } else {
              this.skipLoading = false
              this.$router.push({name: 'BlogDetail', params: {blogId: id}})
            }
          })
        }
      },

      searchKeyword() {
        this.changeStyle("none", ".el-autocomplete-suggestion");
        if (this.input === '') {
          this.forCreated()
        } else {
          this.pageSelect(1)

        }
      },

      pageByYear(currentPage) {
        this.loading = true

        this.$axios.get("/blogsByYear/" + this.year + "/" + currentPage).then(res => {

          this.blogsCommon(res)

          //更换页码后强制浏览器回到顶端
          $("html,body").animate({ scrollTop: 0}, 200);
          this.$router.push("/public/blogs/" + this.year + "/" + currentPage)
          this.loading = false
        })
      },

      page(currentPage) {
        this.loading = true
        this.year = 0
        this.$axios.get("/blogs/" + currentPage).then(res => {

          this.blogsCommon(res)
          //更换页码后强制浏览器回到顶端
          $("html,body").animate({ scrollTop: 0}, 200);

          // document.body.scrollTop = document.documentElement.scrollTop = 0
          // vue不会重复执行created()之类的钩子函数，如果只是参数值变化，页面不会重复刷新，所以不影响效率，仅仅是地址栏改变
          this.$router.push("/public/blogs/" + currentPage)
          this.loading = false
        })
      },

      pageSelect(currentPage) {

        if (this.input !== '') {
          this.searchSorted(currentPage)
        } else {
          if (this.year !== 0) {
            this.pageByYear(currentPage)
          } else {
            this.page(currentPage)
          }
        }
      },

      searchSortedCommon(res) {
        if (res.data.data.total === 0) {
          this.input = ''
          this.searchKeyword()
          this.$message.error("No records")
          this.loading = false
          return
        }

        this.blogsCommon(res)

        $("html,body").animate({ scrollTop: 0}, 200);
      },

      searchSorted(currentPage) {
        this.loading = true
        if (this.year !== 0) {
          //按年份搜索
          this.$axios.get('/searchByYear/1/' + currentPage + '/' + this.year + '?keyword=' + this.input).then(res => {

            this.searchSortedCommon(res)

            this.$router.push("/public/blogs/" + this.year + '/' + currentPage)
            this.loading = false
          })
        } else {
          //不按年份搜索
          this.$axios.get('/search/1/' + currentPage + '?keyword=' + this.input).then(res => {

            this.searchSortedCommon(res)
            this.$router.push("/public/blogs/" + currentPage)
            this.loading = false
          })
        }
      },


      forCreated() {

        this.$emit("title", '')

        if (this.$route.params.year) {
          this.year = this.$route.params.year

          this.$axios.get('/getCountByYear/' + this.year).then(res => {
            this.count = res.data.data
            this.$emit("yearCount", this.year, this.count)
          })

          this.currentPage = this.$route.params.currentPage

          this.pageByYear(this.currentPage)

        } else {
          this.$emit("yearCount", 0, -1)
          this.$emit("choose", "Blog Records")
          this.page(this.$route.params.currentPage)
        }
      }

    },


    created() {

      setTimeout(() => {
        let ele = document.querySelector(".block");

        if (this.isPCOrMobile()) {
          ele.style.width = '45%'
        } else {
          ele.style.width = '300px'
        }
      }, 100)

      if (localStorage.getItem('myToken')) {
        this.$store.state.hasLogin = true
      }

      this.forCreated()
    },

    mounted() {
      this.isPCOrMobile()
    },

    watch: {
      $route(to,from){
        // created:{}里面的方法，同一个组件，不写这个不会再重复判断执行，这里需要一个组件重复执行
        if (from === to) {
          return
        }

        //不加则搜索换页失败
        if (this.input !== '') {
          this.searchSorted(this.currentPage)
          return
        }

        this.year = 0

        this.forCreated()

      }
    }


  }
</script>

<style scoped>

.el-timeline {
  padding: 0;
}

.block {
  width: 50%;
  margin: auto;
}

.image {
  width: 100%;
  display: block;
}


.mPage {
  margin: 0 auto;
  text-align: center;
}

a {
  text-decoration: none;
  color: black;
  font-size: large;
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

/deep/ .el-autocomplete-suggestion{
  width: auto!important;
}

.myItem {
  display: flex;
  flex-direction: row;
  position: absolute;
  width: 250px;
  right: 65px;
  top: 0;
  margin-top: 10px;
}


/*.el-autocomplete {*/
/*  width: 150%;*/
/*  !*margin-left: 95px;*!*/
/*}*/


</style>
