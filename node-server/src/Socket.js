const EventEmitter = require("node:events");

module.exports = class ExtendedSocket extends EventEmitter {
  constructor(socket) {
    super();
    this.originalSocket = socket;
  }

  on(event, cb) {
    this.originalSocket.on(event, cb);
  }

  terminate() {
    this.originalSocket.terminate();
  }

  sendRaw(buffer) {
    this.originalSocket.send(buffer);
  }

  json(obj) {
    const packet = JSON.stringify(obj);
    this.originalSocket.send(packet);
  }

  sendF(id, data) {
    const packet = JSON.stringify({
      ID: id,
      ...data,
    });
    this.originalSocket.send(packet);
  }

  ping(netID) {
    this.sendF("NET.PING", { netID: this.originalSocket.netID || netID });
  }
};
