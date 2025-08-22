const which = require('bare-which')
const spawn = require('../spawn')

function xcrun() {
  return which.sync('xcrun')
}

module.exports = exports = xcrun

exports.find = function find(tool, opts = {}) {
  return spawn(xcrun(), ['--find', tool], opts).stdout.toString().trim()
}
