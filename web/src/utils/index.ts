export function createArray(length: number, value = "") {
  return Array(length).fill(value);
}

export function hackerAlert() {
  log("Nice try buddy");
}

export function log(data: any){
  console.log(data)
}
