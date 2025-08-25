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
}
