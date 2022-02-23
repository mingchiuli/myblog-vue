<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-size: large">Spring-logback后台日志</span>
      <div style="float: right; padding: 0.5% 0;">
        <el-button style="font-size: medium" id="tag-copy" :data-clipboard-text="msg" type="text" @click="copy($event,msg)">复制日志</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button style="font-size: medium" type="text" @click="show">开始监控</el-button>
      </div>
    </div>
    <div v-html="msg" class="text-item" v-loading="loading">
      {{ msg }}
    </div>
  </el-card>
</template>

<script>

let stompClient

import Clipboard from 'clipboard';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import GLOBAL from '@/Global';

export default {
  name: "SystemLogs",
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

    show() {
      this.$axios.get('/startMQ', {
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {
      })
    },

    copy() {
      const clipboard = new Clipboard("#tag-copy")
      clipboard.on('success', e => {
        this.$message({ type: 'success', message: '复制成功' })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({ type: 'warning', message: '该浏览器不支持自动复制' })
        // 释放内存
        clipboard.destroy()
      })
    },


    initWebSocket() {
      this.connectWebSocket();

      this.webSocketTimer = setInterval(() => {
        if (!stompClient.connected) {
          console.log("websocket重连中 ...");
          this.connectWebSocket();
        }
      }, 10000);
    },

    connectWebSocket() {
      const _this = this

      stompClient = new Client({
        connectHeaders: {"Authorization": sessionStorage.getItem("myToken")},
        debug: function (str) {
          //debug日志，调试时候开启
          // console.log(str);
        },
        reconnectDelay: 10000,//重连时间
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.webSocketFactory = function () {
        //因为服务端监听的是/sysLog路径下面的请求，所以跟服务端保持一致
        // return new SockJS("http://127.0.0.1:8081" + '/sysLog', null, {
          return new SockJS(GLOBAL.url + '/sysLog', null, {
          timeout: 10000
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
            "Authorization": sessionStorage.getItem("myToken")
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

</style>
