export const CIRCOM_BIGINT_N = 121;
export const CIRCOM_BIGINT_K = 17;
export function bigIntToChunkedBytes(
    num,
    bytesPerChunk,
    numChunks
  ) {
    const res = [];
    const bigintNum = typeof num == "bigint" ? num : num.valueOf();
    const msk = (1n << BigInt(bytesPerChunk)) - 1n;
    for (let i = 0; i < numChunks; ++i) {
      res.push(((bigintNum >> BigInt(i * bytesPerChunk)) & msk).toString());
    }
    return res;
}

export function toCircomBigIntBytes(num) {
  return bigIntToChunkedBytes(num, CIRCOM_BIGINT_N, CIRCOM_BIGINT_K);
}

export function padString(str, paddedBytesSize) {
  let paddedBytes = Array.from(str, (c) => c.charCodeAt(0));
  const paddingLength = Math.max(0, paddedBytesSize - paddedBytes.length);
  paddedBytes.push(...new Array(paddingLength).fill(0));
  return paddedBytes;
}

export const maskAddress = (str) => {
  // Get the length of the string
  var len = str.length;

  // Check if the string has at least 8 characters
  if (len < 8) {
      return "String must contain at least 8 characters";
  }

  // Extract the first four and last four characters
  var firstFour = str.substring(0, 4);
  var lastFour = str.substring(len - 4);

  // Replace characters in between with '*'
  var middle = "************";

  // Concatenate the masked string
  var maskedStr = firstFour + middle + lastFour;

  return maskedStr;
}