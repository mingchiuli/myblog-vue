<template>
  <div style="width: 70%; margin-left: 15%">

    <div>
      <el-col style="margin-bottom: 5%; margin-top: 5%; text-align: center">
        <el-card style="width: 100%; height: 150px; color: #333;">
          <div style="padding-bottom: 1%; border-bottom: 1px solid #ccc">在线用户<span style="font-size: 12px">(点击聊天气泡开始通讯)</span></div>
          <div style="padding: 10px 0;float: left" v-for="user in users" v-if="user.username !== username" :key="user.username">
            <div> {{user.username}} </div>
            <div>
              <el-avatar size="medium" :src="user.avatar"></el-avatar>
            </div>
            <i class="el-icon-chat-dot-round" style="font-size: 16px; cursor: pointer" @click="chatUser = user.id"></i>
            <span style="font-size: 12px;color: limegreen;" v-if="user.id === chatUser">chatting...</span>
          </div>
        </el-card>
      </el-col>
    </div>

    <div>
      <el-input
          style="width: 50%"
          v-if="user.number === 0"
          placeholder="请输入内容"
          v-model="text"
          clearable>
      </el-input>
      <el-button v-if="user.number === 0" type="primary" icon="el-icon-edit" @click="send"></el-button>
    </div>

    <el-input v-if="user.role === 'admin'" v-model="ruleForm.title" placeholder="标题"></el-input>
    <el-input v-if="user.role === 'admin'" type="textarea" v-model="ruleForm.description" placeholder="摘要"></el-input>


    <el-form v-loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm1">

      <mavon-editor v-if="user.number === 0" v-model="content0" :ishljs = "true" ref="md" @imgAdd="imgAdd" @imgDel="imgDel" code-style="androidstudio"></mavon-editor>

      <mavon-editor v-if="user.number !== 0 & user0" v-model="contentBlank0" :subfield="false"
                    :editable="false"
                    default-open="preview"
                    :navigation="true" :toolbars-flag="false" previewBackground="#ffffff" :scrollStyle="false" code-style="androidstudio">
      </mavon-editor>
    </el-form>

    <el-input
        style="width: 50%"
        v-if="user.number === 1"
        placeholder="请输入内容"
        v-model="text"
        clearable>
    </el-input>
    <el-button v-if="user.number === 1" type="primary" icon="el-icon-edit" @click="send"></el-button>

    <el-form v-loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm2">

      <mavon-editor v-if="user.number === 1" v-model="content1" :ishljs = "true" ref="md" @imgAdd="imgAdd" @imgDel="imgDel" code-style="androidstudio"></mavon-editor>

      <mavon-editor v-else-if="user.number !== 1 & user1" v-model="contentBlank1" :subfield="false"
                    :editable="false"
                    default-open="preview"
                    :navigation="true" :toolbars-flag="false" previewBackground="#ffffff" :scrollStyle="false" code-style="androidstudio">
      </mavon-editor>

    </el-form>


    <el-input
        style="width: 50%"
        v-if="user.number === 2"
        placeholder="请输入内容"
        v-model="text"
        clearable>
    </el-input>
    <el-button v-if="user.number === 2" type="primary" icon="el-icon-edit" @click="send"></el-button>

    <el-form v-loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm2">

      <mavon-editor v-if="user.number === 2" v-model="content2" :ishljs = "true" ref="md" @imgAdd="imgAdd" @imgDel="imgDel" code-style="androidstudio"></mavon-editor>

      <mavon-editor v-else-if="user.number !== 2 & user2" v-model="contentBlank2" :subfield="false"
                    :editable="false"
                    default-open="preview"
                    :navigation="true" :toolbars-flag="false" previewBackground="#ffffff" :scrollStyle="false" code-style="androidstudio">
      </mavon-editor>

    </el-form>

    <el-button style="float: right" v-if="user.role === 'admin'" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>

  </div>
</template>


<script>

let stompClient

import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import GLOBAL from '@/Global'

export default {
  name: "Cooperate",
  data() {
    return {
      user: {},
      chatUser: '',
      text: "",
      blogId: 0,
      username: "",
      messages: [],
      contentBlank0: '',
      contentBlank1: '',
      contentBlank2: '',
      content0: '',
      content1: '',
      content2: '',
      created: '',
      user0: false,
      user1: false,
      user2: false,
      wsBlogId: 0,
      loading: false,


      ruleForm: {
        id: '',
        title: '',
        description: '',
        content: ''
      },

      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入摘要', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
    }
  },

  computed: {
    users: {
      get() {
        return this.$store.state.users
      },

      set(val) {
        this.$store.state.users = val
      }
    }
  },

  created() {
    this.initWebSocket();
  },

  watch: {
    content0: {
      handler: function () {
        this.sync()
      },
      deep: false,
      // immediate: false
    },
    content1: {
      handler: function () {
        this.sync()
      },
      deep: false,
    },
    content2: {
      handler: function () {
        this.sync()
      },
      deep: false,
    },

  },

  methods: {

    sync() {
      let num = this.user.number
      let target = 'content' + num

      try {
        stompClient.publish({
          destination: '/app/sync/' + this.user.id,
          body: this[target] === '' ? ' ' : this[target]
        })
      } catch (e) {
        console.log(e)
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //把管理员包含进来
          let num = this.user.number

          let count = 0

          for (let i = 0; i < 3; i++) {
            if (this['user' + i]) {
              count++
            }
          }


          for (let i = 0; i < count; i++) {

            if (num !== i) {
              let temp = 'contentBlank' + i
              this.ruleForm.content += this[temp]
              this.ruleForm.content += '\n'
            } else {
              let temp = 'content' + num
              this.ruleForm.content += this[temp]
              this.ruleForm.content += '\n'
            }
          }

          this.$axios.post('/blog/edit', this.ruleForm, {
            headers: {
              "Authorization": sessionStorage.getItem("myToken")
            }
          }).then(res => {
            console.log(res)
            stompClient.publish({
              destination: '/app/taskOver/' + this.user.id,
            })

            this.$alert('操作成功', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.disconnectWebSocket()
                this.$router.push("/blogs/1")
              }
            });
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    send() {
      if (!this.chatUser) {
        this.$message({type: 'warning', message: "请选择聊天对象"})
        return;
      }
      if (!this.text) {
        this.$message({type: 'warning', message: "请输入内容"})
        return;
      }

      stompClient.publish({
        destination: '/app/chat/' + this.user.username + '/' + this.chatUser,
        body: this.text
      })

      this.text = ''
    },

    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      const formdata = new FormData();
      formdata.append('image', $file);
      formdata.append('created', this.created)
      this.$axios({
        url: '/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data',"Authorization": sessionStorage.getItem("myToken")},
      }).then((url) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        // $vm.$img2Url(pos, url);
        console.log(url)
        this.$refs.md.$img2Url(pos, url.data.data);
      })
    },

    imgDel(pos) {
      const formdata = new FormData()
      formdata.append('url', pos[0])
      this.$axios({
        url: '/delfile',
        method: 'delete',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data',"Authorization": sessionStorage.getItem("myToken")},
      }).catch(res => {
        console.log(res)
      })
    },

    initWebSocket() {

      this.loading = true
      this.$axios.get('/blogWSCooperate/' + this.$route.params.blogId + '/' + this.$route.params.coNumber,{
        headers: {
          "Authorization": sessionStorage.getItem("myToken")
        }
      }).then(res => {

        const blog = res.data.data.blog
        const users = res.data.data.users

        let username = JSON.parse(sessionStorage.getItem("myUserInfo")).username;
        this.username = username

        for (let i = 0; i < users.length; i++) {
          let user = users[i]
          this['user' + user.number] = true

          this.blogId = this.$route.params.blogId

          if (username === user.username) {
            this.user = user
          }
        }

        this.ruleForm.id = blog.id
        this.ruleForm.title = blog.title
        this.ruleForm.description = blog.description
        this.content0 = blog.content
        this.created = blog.created
        this.wsBlogId = blog.id
        this.loading = false

        this.connectWebSocket();
        // websocket断开重连, 每5s检查一次


      })

      this.webSocketTimer = setInterval(() => {
        if (!stompClient.connected) {

          this.$message.error("websocket重连中 ...")

          this.connectWebSocket();
        }
      }, 10000);

    },

    connectWebSocket() {

      // const socket = new SockJS("http://127.0.0.1:8081/ws");
      // const webStompOptions = {
      //   debug: false
      // }
      // this.stompClient = Stomp.client(socket);
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
        //因为服务端监听的是/ws路径下面的请求，所以跟服务端保持一致
        return new SockJS(GLOBAL.url + '/cooperate', null, {
          timeout: 10000
        });
      };


      stompClient.onConnect = (frame) => {

        stompClient.publish({
          destination: '/app/pushUser/' + this.$route.params.blogId
        })

        stompClient.subscribe('/user/' + this.wsBlogId + '/topic/users', (res) => {

          let users = JSON.parse(res.body);
          this.$store.commit("SET_USERS", users)

          for (let i = 0; i < users.length; i++) {
            let user = users[i]
            this['user' + user.number] = true

            let username = JSON.parse(sessionStorage.getItem("myUserInfo")).username;

            if (username === user.username) {
              this.user = user
            }
          }

        });

        stompClient.subscribe('/user/' + this.wsBlogId + '/topic/popUser', (res) => {

          let users = JSON.parse(res.body);

          this.$store.commit("SET_USERS", users)
        });

        stompClient.subscribe('/topic/content', (res) => {

          this.loading = true

          let msg = JSON.parse(res.body)

          let from = msg.from

          let content = msg.content

          let target = 'contentBlank'

          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === from) {
              target += this.users[i].number
              break
            }
          }

          this[target] = content

          this.loading = false
        });


        //subscribe用不了this.user.id，原因见博客
        //由此得到一个设计思路：在stompClient.onConnect以前，你就必须把stompClient.subscribe('/user/' + this.user.id + '/queue/chat'
        //所需要的user赋值完，也就是stompClient.publish去初始化聊天室的过程应该提前，否则就必须通过sessionStorage去拿参数了
        //可以把初始化聊天室的过程放到axios请求中，stompClient.onConnect只放订阅内容。
        //以后进行修改
        // stompClient.subscribe('/user/' + JSON.parse(sessionStorage.getItem("myUserInfo")).id + '/queue/chat', (res) => {
        stompClient.subscribe('/user/' + this.user.id + '/queue/chat', (res) => {

          let obj = JSON.parse(res.body)

          this.$message({
            showClose: true,
            message: obj.from + '对你说: ' + obj.message,
            type: 'success',
            duration: 20 * 1000,
            onClose:() => {
            }
          });
        });

        stompClient.subscribe('/topic/over', (res) => {
          let from = res.body

          if (this.user.id !== from) {
            this.disconnectWebSocket()
            this.$router.push('/blogs/1')
          }
        })
      };

      stompClient.onStompError = function (frame) {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      };
      stompClient.activate();
    },

    disconnectWebSocket() {
      if (stompClient !== null) {

        try {
          stompClient.publish({
            destination: '/app/destroy/' + this.blogId,
            headers: { Authorization: sessionStorage.getItem("myToken") },
          })
        } catch (e) {
          console.log(e)
        }
        stompClient.deactivate()
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
