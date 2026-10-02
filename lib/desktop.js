const runtime = require('#runtime')
const build = require('./build')
const spawn = require('./spawn')

exports.run = async function run(entry, opts) {
  const { host = runtime.host } = opts

  const { executable, destroy } = await build(entry, host, opts)

  try {
    return spawn(executable, [], { stdio: 'inherit' })
  } finally {
    destroy()
  }
}
