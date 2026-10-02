const runtime = require('#runtime')
const errors = require('./errors')
const build = require('./build')
const simctl = require('./ios/simctl')

exports.run = async function run(entry, opts) {
  const { host = runtime.host } = opts

  let device = null

  for (const candidate of simctl.list()) {
    if (typeof opts.device === 'string') {
      if (candidate.name.toLowerCase().includes(opts.device.toLowerCase())) {
        device = candidate
        break
      }
    } else if (candidate.state === 'booted') {
      device = candidate
      break
    }
  }

  if (device === null) {
    throw errors.UNKNOWN_DEVICE('Could not find a device')
  }

  const { executable, destroy } = await build(entry, host, opts)

  try {
    return simctl.spawn(device.id, executable, [], { stdio: 'inherit' })
  } finally {
    destroy()
  }
}
