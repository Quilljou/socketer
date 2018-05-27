const net = require('net');
const EventEmitter = require('events');


class TcpClient extends EventEmitter{
  constructor() {
    super();
    this.client = null;
  }
  sendMessage(message) {
    message = message.split(' ').join('')
    let flushed = this.client.write(Buffer.from(message,'hex'));
  }

  connect({ host, port }) {
    this.client = null;
    this.connected = false;
    let client = new net.Socket();
    client.connect(port,host,() => {
      this.connected = true;
      this.emit('connectSuccess')
    });
    client.on('error',() => {
      if(!this.connected) {
        this.emit('connectFail')
      }
    });
    client.on('data',(data) => this.emit('data',data));
    client.on('close', () => {
      this.emit('disconnected')
    });
    this.client = client;
  }


  disconnect() {
    if(this.client.destroyed) return;
    this.client.end();
  }
}


export default TcpClient;
