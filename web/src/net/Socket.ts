import { NOOP, log, safeJSONParse } from "../utils";

type NetOpts = {
  useBase64Encoding: boolean;
};

export default class Socket extends WebSocket {
  opts: NetOpts;
  onJson: (data: any) => void;
  onConnected: () => void;

  constructor(url: string | URL, opts?: NetOpts, protocol?: string | string[]) {
    super(url, protocol);

    const defaultOpts: NetOpts = {
      useBase64Encoding: false,
    };

    this.opts = {
      ...defaultOpts,
      ...opts,
    };

    this.onJson = NOOP;
    this.onConnected = NOOP;

    this.addEventListener("open", this.onOpenSocket.bind(this));
    this.addEventListener("message", this.onMessageBuffer.bind(this));
  }

  onOpenSocket() {
    console.log("Open");
    this.onConnected();
  }

  onMessageBuffer(ev: MessageEvent) {
    const data = ev.data;
    const json = this.readJSON(data);

    if (json) this.onJson(json);
  }

  sendJSON(json: { [key: string]: any }) {
    let data = JSON.stringify(json);

    if (this.opts.useBase64Encoding) data = btoa(data);

    return this.write(data);
  }

  readJSON(data: string) {
    let json = data;

    if (this.opts.useBase64Encoding) json = atob(json);

    json = safeJSONParse(data);
    if (!json) return log(`Data '${data}' is not a valid JSON format.`);
    return json;
  }

  write(data: any) {
    if (this.readyState !== WebSocket.OPEN) {
      return log(`Cannot send packet, Connection is not ready`);
    }

    return this.send(data);
  }
}
