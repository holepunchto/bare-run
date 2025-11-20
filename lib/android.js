const path = require('path')
const fs = require('fs')
const os = require('os')
const errors = require('./errors')
const prebuilds = require('./prebuilds')
const adb = require('./android/adb')

exports.run = async function run(bundle, opts) {
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

  const tmp = path.join(os.tmpdir(), `${bundle.id}.bundle`)
  fs.writeFileSync(tmp, bundle.toBuffer())

  const filename = path.join(root, `${bundle.id}.bundle`)
  adb.push(device.id, tmp, filename, { stdio: 'ignore' })

  if (opts.lowPower) {
    adb.shell(device.id, 'dumpsys', ['battery', 'unplug'])
    adb.shell(device.id, 'settings', ['put', 'global', 'low_power', '1'])
  }

  if (opts.doze) {
    adb.shell(device.id, 'dumpsys', ['deviceidle', 'force-idle'])
  }

  adb.push(device.id, prebuilds[`android-${device.arch}`](), root, {
    stdio: 'ignore'
  })

  if (opts.lowPower || opts.doze) {
    adb.shell(device.id, 'dumpsys', ['battery', 'reset'])
  }

  if (opts.doze) {
    adb.shell(device.id, 'dumpsys', ['deviceidle', 'unforce'])
  }

  const driver = path.join(root, 'bare-run')
  adb.shell(device.id, driver, [filename], { stdio: 'inherit' })

  adb.shell(device.id, 'rm', [filename])
  adb.shell(device.id, 'rm', [driver])

  fs.rmSync(tmp)
}
