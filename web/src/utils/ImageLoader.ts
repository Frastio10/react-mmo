export default class ImageLoader {
  static loadBase64(base64: string, cb: (img: HTMLImageElement) => void) {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      cb(img);
    };
  }
}
