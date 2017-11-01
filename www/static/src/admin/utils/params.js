export function mergeSearch(param) {
  const strArr = [];
  for (const k in param) {
    if (param.hasOwnProperty(k)) {
      strArr.push(`${k}=${param[k]}`);
    }
  }
  return strArr.join('&');
}
