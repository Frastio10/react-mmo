module.exports = class Packet {
  constructor(buffer) {
    this.packetObj = null;
    this.ID = null;
    this.data = null;

    if (buffer) {
      this.packetObj = this.validate(buffer);
    }

    if (this.packetObj) {
      const { ID, ...data } = this.packetObj;
      this.ID = ID;
      this.data = data;
    }
  }

  create(scope, event, data) {
    return {
      ID: `${scope}.${event}`,
      ...data,
    };
  }

  getScope() {
    const scope = this.ID.split(".")[0];
    return scope;
  }

  getEvent() {
    const event = this.ID.split(".")[1];
    return event;
  }

  json(id, data) {
    const obj = data || this.data;
    return {
      ID: id || this.ID,
      ...obj,
    };
  }

  parseString(string) {
    let parsedPacket = null;
    try {
      parsedPacket = JSON.parse(string);
      return parsedPacket;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  parseBuffer(buffer) {
    if (!Buffer.isBuffer(buffer)) return;
    let parsedPacket = buffer.toString();
    try {
      parsedPacket = JSON.parse(parsedPacket);
      return parsedPacket;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validate(packetObj) {
    if (Buffer.isBuffer(packetObj)) packetObj = this.parseBuffer(packetObj);
    if (typeof packetObj === "string") packetObj = this.parseString(packetObj);
    if (!packetObj.ID) return false;

    return packetObj;
  }
};
