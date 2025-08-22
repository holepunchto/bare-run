const process = require('process')
const path = require('path')
const childProcess = require('child_process')

module.exports = function spawn(file, args = [], opts = {}) {
  const {
    env = process.env,
    cwd = path.resolve('.'),
    input,
    stdio = [input ? null : 'ignore', 'pipe', 'inherit'],
    shell = requiresShell(file)
  } = opts

  return childProcess.spawnSync(file, args, {
    encoding: 'utf-8',
    stdio,
    env,
    cwd,
    input,
    shell
  })
}

function requiresShell(cmd) {
  if (process.platform !== 'win32') return false

  const ext = path.extname(cmd).toLowerCase()

  return ext === '.bat' || ext === '.cmd'
}
