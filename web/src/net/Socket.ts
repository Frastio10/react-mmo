import { log, safeJSONParse } from "../utils";

type NetOpts = {
  useBase64Encoding: boolean;
};

export default class Socket extends WebSocket {
  opts: NetOpts;

  constructor(url: string | URL, opts?: NetOpts, protocol?: string | string[]) {
    super(url, protocol);

    const defaultOpts: NetOpts = {
      useBase64Encoding: true,
    };

    this.opts = {
      ...defaultOpts,
      ...opts,
    };
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
