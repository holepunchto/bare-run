const process = require('process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const errors = require('./errors')
const prebuilds = require('./prebuilds')
const adb = require('./android/adb')

exports.run = async function run(bundle, opts) {
  const { arch = process.arch } = opts

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

  const root = '/data/local/tmp/bare-test-driver'

  adb.shell(device.id, `mkdir -p ${root}`, opts)

  const tmp = path.join(os.tmpdir(), `${bundle.id}.bundle`)

  fs.writeFileSync(tmp, bundle.toBuffer())

  const filename = path.join(root, `${bundle.id}.bundle`)

  adb.push(device.id, tmp, filename, { stdio: 'ignore' })

  adb.push(device.id, prebuilds[`android-${arch}`](), root, { stdio: 'ignore' })

  const driver = path.join(root, 'bare-test-driver')

  adb.shell(device.id, `${driver} ${filename}`, {
    stdio: 'inherit'
  })
}
