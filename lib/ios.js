const path = require('path')
const fs = require('fs')
const errors = require('./errors')
const prebuilds = require('./prebuilds')
const simctl = require('./ios/simctl')

exports.run = async function run(bundle, opts) {
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

  const root = path.join(device.data, 'tmp', 'bare-run')

  fs.mkdirSync(root, { recursive: true })

  const filename = path.join(root, `${bundle.id}.bundle`)

  fs.writeFileSync(filename, bundle.toBuffer())

  simctl.spawn(device.id, prebuilds['ios-arm64-simulator'](), [filename], {
    stdio: 'inherit'
  })
}
