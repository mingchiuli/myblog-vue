<template>
  <div>
    <div style="margin-left: 25%; max-width: 50%; margin-top: 15px">
      <el-tabs :stretch=true v-model="activeName">

        <el-tab-pane label="Disqus(Please take scientific networking)" name="first">
          <div class="comments">
            <Disqus shortname="81-68-192-120"></Disqus>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Utterance(Immune GFW)" name="second">
          <div id="utterance" style="width: inherit"></div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>


</template>
<script>

import { Disqus } from 'vue-disqus'

export default {
  name: 'Comment',
  components:{Disqus},
  data() {
    return {
      activeName: 'first'
    };
  },

  methods: {
    init () {
      // 建立脚本以及属性
      const utterances = document.createElement('script');
      utterances.type = 'text/javascript';
      utterances.async = true;
      utterances.setAttribute('issue-term', 'pathname')
      utterances.setAttribute('theme','github-light')
      utterances.setAttribute('repo',`mingchiuli/utterancesDemo`)
      utterances.crossorigin = 'anonymous';
      utterances.src = 'https://utteranc.es/client.js';

      document.getElementById('utterance').appendChild(utterances);

    },


  },
  mounted: function(){
    // 每次挂载时候，进行初始化
    this.init()
  }
}
</script>
