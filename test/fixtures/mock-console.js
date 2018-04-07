let oldConsoleError;
let oldConsoleLog;

const mockConsole = {
  start() {
    oldConsoleError = console.error;
    oldConsoleLog = console.log;

    console.error = () => {};
    console.log = () => {};
  },

  stop() {
    console.error = oldConsoleError;
    console.log = oldConsoleLog;
  }
};

module.exports = mockConsole;
