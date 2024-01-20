export function createArray(length: number, value = "") {
  return Array(length).fill(value);
}

export function hackerAlert() {
  log("Nice try buddy");
}

export function log(data: any) {
  console.log(data);
}

export function safeJSONParse(str: any) {
  let parsed;

  try {
    parsed = JSON.parse(str);
  } catch (e) {
    // Oh well, but whatever...
  }

  return parsed; // Could be undefined!
}
