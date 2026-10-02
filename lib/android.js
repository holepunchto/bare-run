const path = require('path')
const errors = require('./errors')
const build = require('./build')
const adb = require('./android/adb')

exports.run = async function run(entry, opts) {
  let device = null

  for (const candidate of adb.devices()) {
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

  const root = '/data/local/tmp/bare-run'
  adb.shell(device.id, 'mkdir', ['-p', root])

  const { executable, destroy } = await build(entry, `android-${device.arch}`, opts)

  const driver = path.posix.join(root, path.basename(executable))

  try {
    adb.push(device.id, executable, driver, { stdio: 'ignore' })
  } finally {
    destroy()
  }

  if (opts.lowPower) {
    adb.shell(device.id, 'dumpsys', ['battery', 'unplug'])
    adb.shell(device.id, 'settings', ['put', 'global', 'low_power', '1'])
  }

  if (opts.doze) {
    adb.shell(device.id, 'dumpsys', ['deviceidle', 'force-idle'])
  }

  const result = adb.shell(device.id, driver, [], { stdio: 'inherit' })

  if (opts.lowPower || opts.doze) {
    adb.shell(device.id, 'dumpsys', ['battery', 'reset'])
  }

  if (opts.doze) {
    adb.shell(device.id, 'dumpsys', ['deviceidle', 'unforce'])
  }

  adb.shell(device.id, 'rm', [driver])

  return result
}
