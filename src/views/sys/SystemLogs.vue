<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span id="SLTitle">Spring-logback backstage logs</span>
        <div id="SLContent">
          <el-button class="SLButton" id="tag-copy" :data-clipboard-text="msg" type="text" @click="copy($event,msg)">Copy logs</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="SLButton" type="text" @click="show">Start monitor</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="SLButton" type="text" @click="stop">Stop monitor</el-button>
        </div>
      </div>
      <div v-html="msg" class="text-item" v-loading="loading">
        {{ msg }}
      </div>
    </el-card>
    <Footer></Footer>
  </div>

</template>

<script>

import Footer from "@/components/Footer";
let stompClient

import Clipboard from 'clipboard';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import GLOBAL from '@/Global';

export default {
  name: "SystemLogs",
  components: {Footer},
  data() {
    return {
      msg: '',
      loading: false
    }
  },

  created() {
    this.initWebSocket();
  },

  methods: {
    stop() {
      this.$axios.get('/stopMQ', {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success("Operation successful!")
        }
      })
    },

    show() {
      this.$axios.get('/startMQ', {
        headers: {
          "Authorization": localStorage.getItem("myToken")
        }
      }).then(res => {
      })
    },

    copy() {
      const clipboard = new Clipboard("#tag-copy")
      clipboard.on('success', e => {
        this.$message({ type: 'success', message: 'Operation successful!' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({ type: 'warning', message: 'Operation fail!' })
        // 释放内存
        clipboard.destroy()
      })
    },


    initWebSocket() {
      this.connectWebSocket();

      this.webSocketTimer = setInterval(() => {
        if (!stompClient.connected) {
          this.$message.error("websocket reconnection ...")
          this.connectWebSocket();
        }
      }, 2000);
    },

    connectWebSocket() {
      const _this = this

      stompClient = new Client({
        connectHeaders: {"Authorization": localStorage.getItem("myToken")},
        debug: function (str) {
          //debug日志，调试时候开启
          // console.log(str);
        },
        reconnectDelay: 2000,//重连时间
        heartbeatIncoming: 2000,
        heartbeatOutgoing: 2000,
      });

      stompClient.webSocketFactory = function () {
        //因为服务端监听的是/sysLog路径下面的请求，所以跟服务端保持一致
          return new SockJS(GLOBAL.url + '/sysLog', null, {
          timeout: 40000
        });
      };


      stompClient.onConnect = (frame) => {

        stompClient.subscribe('/logs/log', (res) => {
          _this.loading = true
          _this.msg += res.body + '<br>' + '<br>'
          _this.loading = false
        });
      };


      stompClient.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      };


      stompClient.activate();
    },

    disconnectWebSocket() {
      if (stompClient !== null) {

        this.$axios.get('/stopMQ', {
          headers: {
            "Authorization": localStorage.getItem("myToken")
          }
        }).then(res => {
          stompClient.deactivate()
        })
      }
    },

  },

  destroyed: function () {
    clearInterval(this.webSocketTimer);
    this.disconnectWebSocket();
  },


}
</script>

<style scoped>
#SLTitle {
  font-size: large;
}

#SLContent {
  float: right;
  padding: 0.5% 0;
}

.SLButton {
  font-size: medium;
}

</style>
