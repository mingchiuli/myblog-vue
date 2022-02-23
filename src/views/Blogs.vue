<template>
  <div>
    <div class="myItem">
<!--      width: 0解决flex Sider被拉伸的问题-->
      <Sider style="width: 0;margin-left: 10%;"></Sider>

      <el-autocomplete
          v-model="input"
          @keyup.enter.native="searchKeyword"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          clearable style="width: 15%;margin-top: 10px;margin-left: 65%;"
      ></el-autocomplete>

      <el-button @click="searchKeyword" type="success" plain style="margin-top: 10px;font-size: smaller;" icon="el-icon-search"></el-button>
    </div>


    <div class="m-content" v-if="year === 0">
      <h1>日志</h1>
      <hr>
    </div>

    <div class="m-content" v-else-if="year !== 0">
      <h1>归档{{year}}({{count}})</h1>
      <hr>
    </div>

    <LoginStatus></LoginStatus>


    <div class="block">
      <el-timeline>
        <el-timeline-item :timestamp="blog.created" placement="top" v-for="blog in blogs" color="#0bbd87">
          <el-card class="el-card" v-loading="loading">
            <h4>
              <el-link style="color: black" type="info" plain @click="blogStatus(blog.id)">{{blog.title}}</el-link>
            </h4>
            <p>{{blog.description}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-pagination class="mpage"
                     background
                     layout="prev, pager, next"
                     :current-page="currentPage"
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
        searchAbstract: [],
        timeout: null
      }
    },
    methods: {

      querySearchAsyncCommon(res, cb) {
        let raw = res.data.data.records

        console.log(raw)
        let results = this.transSearchContent(raw)
        console.log(results)
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 500);
      },

      querySearchAsync(input, cb) {
        if (this.year !== 0) {
          this.$axios.get('/searchByYear/' + 1 + '/' + this.year + '?keyword=' + input).then(res => {
            this.querySearchAsyncCommon(res, cb)
          })
        } else {
          this.$axios.get('/search/' + 1 + '?keyword=' + input).then(res => {
            this.querySearchAsyncCommon(res, cb)
          })
        }
      },

      transSearchContent(array) {

        let results = []

        array.forEach((item) => {
          let temp = {"value": item.title, "id": item.id}
          results.push(temp)
        })

        return results
      },

      handleSelect(item) {
        this.$router.push('/blog/' + item.id)
      },

      blogStatus(id) {
        const _this = this
        this.$axios.get('/blogStatus/' + id).then(res => {
          const status = res.data.data
          if ((status === 1 && !sessionStorage.getItem("myToken")) || (status === 1 && JSON.parse(sessionStorage.getItem("myUserInfo")).role !== 'admin')) {

            this.$prompt('请输入阅读密钥', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {

              _this.$router.push('/blog/' + id + '?token=' + value)

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '联系博主获取密钥'
              });
            });

          } else {
            _this.$router.push({name: 'BlogDetail', params: {blogId: id}})
          }
        })
      },

      searchKeyword() {
        if (this.input === '') {
          this.forCreated()
        } else {
          this.pageSelect(1)

        }
      },

      pageByYear(currentPage) {
        this.loading = true
        const _this = this
        _this.$axios.get("/blogsByYear/" + this.year + "/" + currentPage).then(res => {
          _this.blogs = res.data.data.records
          for (let i = 0; i < _this.blogs.length; i++) {
            _this.blogs[i].created = _this.blogs[i].created.substring(0, 10)
          }
          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size

          //更换页码后强制浏览器回到顶端
          $("html,body").animate({ scrollTop: 0}, 200);
          _this.$router.push("/blogs/" + this.year + "/" + currentPage)
          _this.loading = false
        })
      },

      page(currentPage) {
        this.loading = true
        this.year = 0
        const _this = this
        _this.$axios.get("/blogs/" + currentPage).then(res => {
          _this.blogs = res.data.data.records
          for (let i = 0; i < _this.blogs.length; i++) {
            _this.blogs[i].created = _this.blogs[i].created.substring(0, 10)
          }

          _this.currentPage = res.data.data.current
          _this.total = res.data.data.total
          _this.pageSize = res.data.data.size
          //更换页码后强制浏览器回到顶端
          $("html,body").animate({ scrollTop: 0}, 200);

          // document.body.scrollTop = document.documentElement.scrollTop = 0
          // vue不会重复执行created()之类的钩子函数，如果只是参数值变化，页面不会重复刷新，所以不影响效率，仅仅是地址栏改变
          _this.$router.push("/blogs/" + currentPage)
          _this.loading = false
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
          this.$message.error("没有相关记录")
          this.loading = false
          return
        }

        this.blogs = res.data.data.records

        for (let i = 0; i < this.blogs.length; i++) {
          this.blogs[i].created = this.blogs[i].created.replace('T', ' ')
        }
        this.currentPage = res.data.data.current
        this.total = res.data.data.total
        this.pageSize = res.data.data.size

        $("html,body").animate({ scrollTop: 0}, 200);
      },

      searchSorted(currentPage) {
        this.loading = true
        const _this = this
        if (this.year !== 0) {
          //按年份搜索
          this.$axios.get('/searchByYear/' + currentPage + '/' + _this.year + '?keyword=' + this.input).then(res => {

            this.searchSortedCommon(res)

            _this.$router.push("/blogs/" + _this.year + '/' + currentPage)
            _this.loading = false
          })
        } else {
          //不按年份搜索
          this.$axios.get('/search/' + currentPage + '?keyword=' + this.input).then(res => {

            this.searchSortedCommon(res)
            _this.$router.push("/blogs/" + currentPage)
            _this.loading = false
          })
        }
      },


      forCreated() {

        if (this.$route.params.year) {
          const _this = this
          this.year = this.$route.params.year

          this.$axios.get('/getCountByYear/' + this.year).then(res => {
            _this.count = res.data.data
          })

          this.currentPage = this.$route.params.currentPage
          this.pageByYear(this.currentPage)

        } else {
          this.page(this.$route.params.currentPage)
        }
      }

    },


    created() {

      if (sessionStorage.getItem('myToken')) {
        this.$store.state.hasLogin = true
      }

      this.forCreated()
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

        if (this.$route.params.year) {
          const _this = this
          this.year = this.$route.params.year

          this.$axios.get('/getCountByYear/' + _this.year).then(res => {
            this.count = res.data.data
          })

          this.currentPage = this.$route.params.currentPage
          this.pageByYear(this.currentPage)

        } else {

          this.page(this.$route.params.currentPage)

        }
      }
    }


  }
</script>

<style scoped>

  .el-card {
    max-width: 80%;
  }

  .el-timeline-item {
    margin-left: 15%;
  }

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

  a {
    text-decoration: none;
    color: black;
    /*border-bottom: 1px dashed;*/
    font-size: large;
  }

  .block {
    margin-top: 3%;
  }


  .m-content {
    max-width: 100%;
    margin-top: 0;
    text-align: center;

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


  .myItem {
    /*位于一行*/
    display: flex;
    flex-direction: row;
  }


</style>
