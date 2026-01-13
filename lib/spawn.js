const path = require('path')
const childProcess = require('child_process')

module.exports = function spawn(file, args = [], opts = {}) {
  const {
    cwd = path.resolve('.'),
    input,
    stdio = [input ? null : 'ignore', 'pipe', 'inherit']
  } = opts

  return childProcess.spawnSync(file, args, {
    encoding: 'utf-8',
    cwd,
    input,
    stdio
  })
}
