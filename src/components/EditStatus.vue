<template>
  <div class="status" v-if="hasLogin">
    <el-link icon="el-icon-edit">
      <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" style="font-size: medium; color: green">
        <!--        编辑-->
        <el-button type="text" style="font-size: medium; color: limegreen">Edit</el-button>

      </router-link>
    </el-link>
    <el-divider class="el-div" direction="vertical"></el-divider>
    <el-divider class="el-div" direction="vertical"></el-divider>
    <el-link icon="el-icon-delete">
      <el-button type="text" @click="deleteBlog" style="font-size: medium; color: indianred">Delete</el-button>
    </el-link>
  </div>
</template>

<script>
export default {
  name: "EditStatus",
  data() {
    return {

    }
  },

  props: {
    blog: {}
  },

  methods: {
    deleteBlog() {
      const ids = []
      ids.push(this.blog.id)
      this.$confirm('Delete the blog?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/deleteBlogs', ids, {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
          this.$router.push('/public/blogs/1')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Deletion cancelled'
        });
      });
    },
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
}
</script>

<style scoped>
.status {
  margin-left: 15%;
}
</style>
