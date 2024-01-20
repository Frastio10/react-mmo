import Socket from "../net/Socket";

export default class Network {
  ws: Socket;
  constructor() {
    console.log("hello from network");

    this.ws = new Socket("ws://localhost:8081");
    this.ws.addEventListener("open", () => console.log("connected"));
    this.ws.addEventListener("message", (buf: any) => {
      console.log(buf.data);
    });
  }
}
