exports.host = `${process.platform}-${process.arch}`

Object.defineProperty(exports, 'exitCode', {
  get() {
    return process.exitCode
  },
  set(code) {
    process.exitCode = code
  }
})
