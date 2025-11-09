function randomString() {
  let result = "";
  const length = 16;
  const chars =
    "0123!456789abcdefghij!klmnopqrstuvwxyzABCDEFG!HIJKLMNOPQR!STUXYZ.!";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export default randomString;
