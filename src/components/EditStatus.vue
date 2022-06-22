<template>
  <div class="status" v-if="hasLogin">
    <el-link icon="el-icon-edit">
      <router-link id="ESlink" :to="{name: 'BlogEdit', params: {blogId: blog.id}}">
        <el-button id="ESButton" type="text">Edit</el-button>
      </router-link>
    </el-link>
    <el-divider class="el-div" direction="vertical"></el-divider>
    <el-divider class="el-div" direction="vertical"></el-divider>
    <el-link icon="el-icon-delete">
      <el-button id="ESDELButton" type="text" @click="deleteBlog">Delete</el-button>
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

#ESlink {
  font-size: medium;
  color: green;
}

#ESButton {
  font-size: medium;
  color: limegreen;
}

#ESDELButton {
  font-size: medium;
  color: indianred;
}
</style>
