<template>
  <div class="footer">
    <hr>
    <div class="copyright">&copy; <a href="/"> Mingchiu Li </a> {{yearBegin}}-{{yearEnd}} </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      yearBegin: 2021,
      yearEnd: 2021
    }
  },

  created() {
    this.$axios.get('/searchYears').then(res => {
      let years = res.data.data
      this.$store.commit("SET_YEARS", years)
      this.yearBegin = years[0]
      this.yearEnd = years[years.length - 1]
    })

  }
}
</script>

<style scoped>

.footer {
  margin-top: 4%;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid;
  margin-top: 4%;
  margin-bottom: 3%;
  padding: 0;
  max-width: 20%;
  color: lightgray;

}

.copyright {
  height: 50px;
  text-align: center;
  font-size: 17px;
}



a {
  text-decoration: none;
  color: black;
  font-family: "Brush Script MT",serif;
  font-size: 20px;
}

</style>
