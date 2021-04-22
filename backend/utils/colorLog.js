const colorLog = (type, msg, ...rest) => {
  switch (type) {
    case "success":
      return console.log("\x1b[32m%s\x1b[0m", msg, rest);
    case "warning":
      return console.log("\x1b[33m%s\x1b[0m", msg, rest);
    case "info":
      return console.log("\x1b[36m%s\x1b[0m", msg, rest);
    case "error":
      return console.log("\x1b[31m%s\x1b[0m", msg, rest);
    default:
      return console.log("\x1b[36m%s\x1b[0m", msg, rest);
  }
};

export default colorLog;
