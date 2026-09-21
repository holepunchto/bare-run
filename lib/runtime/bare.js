exports.host = Bare.Addon.host

Object.defineProperty(exports, 'exitCode', {
  get() {
    return Bare.exitCode
  },
  set(code) {
    Bare.exitCode = code
  }
})
