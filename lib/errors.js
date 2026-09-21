const os = require('os')

module.exports = class TestError extends Error {
  constructor(msg, fn = TestError, code = fn.name) {
    super(`${code}: ${msg}`)
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, fn)
    }
  }

  get name() {
    return 'TestError'
  }

  static UNKNOWN_DEVICE(msg) {
    return new TestError(msg, TestError.UNKNOWN_DEVICE)
  }

  static PROCESS_FAILED(status) {
    const err = new TestError(`Process exited with code ${status}`, TestError.PROCESS_FAILED)
    err.status = status
    return err
  }

  static PROCESS_KILLED(signal) {
    const err = new TestError(`Process was killed with signal ${signal}`, TestError.PROCESS_KILLED)
    err.signal = signal
    err.status = 128 + os.constants.signals[signal]
    return err
  }
}
