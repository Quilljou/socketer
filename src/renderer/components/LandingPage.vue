<template>
  <div id="wrapper">
    <p class="title">TCP server</p>
    <el-form ref="server" :model="server" label-width="80px">
      <el-form-item label="服务器">
        <el-input v-model="server.host"></el-input>
      </el-form-item>
      <el-form-item label="端口">
        <el-input v-model="server.port"></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio disabled v-model="isTryReconnect">断线重连</el-radio>
      </el-form-item>
      <el-form-item>
          <el-button v-if="!connected" type="primary" @click="connectServer" :disabled="!isAbleConnect">连接</el-button>
         <el-button v-else type="danger" @click="disConnectServer">断开连接</el-button>
      </el-form-item>
    </el-form>
    <p class="title">Req</p>
    <el-form ref="server" :model="server" label-width="80px">
      <el-form-item>
        <el-input type="textarea" v-model="message" :disabled="!isAbleWrite"></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio disabled >16进制发送</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMessage" :disabled="!isAbleSend">发送</el-button>
         <el-button  @click="clearMessage" :disabled="!isMessageNotEmpty">清空</el-button>
      </el-form-item>
    </el-form>
    <p class="title">Res</p>
    <div class="res">
      <el-row v-for="(item,index) in res" style="margin-bottom: 10px">
        <el-col :push="2" :span="8">
          <el-button type="danger" @click="clearRes(index)" size="mini">清除</el-button>
          &nbsp;
          &nbsp;
          {{ index + 1}}.
          {{ item.time | dateFormat }}
        </el-col>
        <el-col :span="9">
          {{ item.data.toString('hex').toUpperCase() }}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import TcpClient from '../service/tcpClient';
import util  from '../utils/util';

export default {
  name: 'landing-page',
  mounted() {
    const h = this.$createElement;
    let client = new TcpClient();
    this.client = client;

    client.on('error',() =>{
      console.log('onerror');
    })

    client.on('connectSuccess',() =>{
      this.$notify({
        title: '提示',
        message: h('p', '连接成功')
      });
      this.connected = true;
    })

    client.on('connectFail',() => {
      this.$notify({
        title: '提示',
        message: h('p', '连接失败，请重试')
      });
    })

    client.on('disconnected',() =>{
      this.$notify({
        title: '提示',
        message: h('p', '连接中断')
      });
      this.connected = false;
    })

    client.on('data',(data) => {
      this.res.push({
        data: data,
        time: Date.now()
      });
    })

  },
  data() {
    return {
      client: null,
      connected: false,
      server: {
        host: '127.0.0.1',
        port: ''
      },
      message: '',
      isTryReconnect: true,
      res: [],
    }
  },
  filters: {
    dateFormat(stamp) {
      return util.dateFormat(stamp,'yyyy-MM-dd hh:mm:ss')
    }
  },
  computed: {
    isAbleConnect() {
      return Boolean(this.server.host.trim().length && this.server.port.trim().length);
    },
    isAbleWrite() {
      return this.connected;
    },
    isMessageNotEmpty() {
      return this.message.trim().length > 0;
    },
    isAbleSend() {
      return this.isAbleWrite && this.isMessageNotEmpty;
    }
  },
  methods: {
    sendMessage() {
      this.client.sendMessage(this.message);
    },
    clearMessage() {
      this.message = '';
    },
    connectServer() {
      this.client.connect(this.server);
    },
    disConnectServer() {
      this.client.disconnect()
    },
    clearRes(index) {
      this.res = this.res.filter((item,i) => {
        if(index == i) {
          return false;
        }
        return true;
      })
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100%;
    padding: 60px 80px;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
