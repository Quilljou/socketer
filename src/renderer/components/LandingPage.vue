<template>
  <div id="wrapper">
    <p class="title">TCP Client</p>
    <el-form ref="server" :model="server" label-width="80px">
      <el-form-item label="服务器">
        <el-input v-model="server.host"></el-input>
      </el-form-item>
      <el-form-item label="端口">
        <el-input v-model="server.port"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox disabled v-model="isTryReconnect">断线重连</el-checkbox>
      </el-form-item>
      <el-form-item>
          <el-button v-if="!connected" type="primary" @click="connectServer" :disabled="!isAbleConnect">连接</el-button>
         <el-button v-else type="danger" @click="disConnectServer">断开连接</el-button>
      </el-form-item>
    </el-form>
    <p class="title">Req</p>
    <el-form ref="server" :model="server" label-width="80px">
      <el-form-item>
        <div class="text-right">
          {{ byteLength || 0 }}字节
        </div>
        <el-input type="textarea" v-model="message" :disabled="!isAbleWrite"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox  v-model="isHexWrite" disabled>16进制发送</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMessage" :disabled="!isAbleSend">发送</el-button>
        <el-button  @click="clearMessage" :disabled="!isMessageNotEmpty">清空</el-button>
      </el-form-item>
    </el-form>
    <p class="title">Res</p>
    <div class="res">
      <div class="res-list">
        <div v-for="(item,index) in res"
         class="res-item">
          <div class="res-index" >
            {{ index + 1}}.
            {{ item.time | dateFormat }}
          </div>
          <div class="res-data">
              <div class="data">
                  {{ item.data.toString('hex').toUpperCase() }}
                <!-- {{ item.data }} -->
              </div>
            <div class="button-wrap">
              <el-button size="mini" @click="clearRes(index)" type="danger" icon="el-icon-delete" round>
                <!-- 清除 -->
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <el-form>
        <el-form-item>
          <el-checkbox  v-model="isHexShow" disabled>16进制显示</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button  @click="emptyRes"  :disabled="isResEmpty">清空</el-button>
        </el-form-item>
      </el-form>
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
      console.log(data.toString('hex'));
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
      // res: [{
      //   time: Date.now(),
      //   data: '57656C636F6D6520746F20746865204173796E63536F636B6574204563686F205365727665720D0A57656C636F6D6520746F20746865204173796E63536F636B6574204563686F205365727665720D0A'
      // }],
      res: [],
      isHexWrite: true,
      isHexShow: true
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
    },
    isResEmpty() {
      return this.res.length <= 0;
    },
    byteLength() {
      let strLength = this.message.trim().length;
      return this.isHexWrite ? Math.floor(strLength / 2) : Math.floor(strLength / 8);
    }
  },
  methods: {
    sendMessage() {
      let message = this.message;
      // if(!this.isHexWrite) {
      //   message = parseInt(message,2).toString(16)
      // }
      this.client.sendMessage(message);
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
    },

    emptyRes() {
      this.res = [];
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
    width: 100%;
    color: #999;
    overflow: scroll;
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

  .text-right {
    text-align: right;
  }


  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .res {
    margin-left: 80px;
    width: auto;
  }

  .res-list {
    background: white;
    min-height: 60px;
    border: 1px solid #ddd;
    padding: 10px 8px;
  }

  .res-item {
    display: flex;
    margin-bottom: 10px;
    align-items: center
  }

  .res-index {
    min-width: 180px;
  }

  .res-data {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .res-data .data{
    flex: 1;
    text-align: left;
    word-break: break-all;
  }

  .res-data .button-wrap{
    width: 100px;
    text-align: center;
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
