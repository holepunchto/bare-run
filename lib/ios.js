const path = require('path')
const fs = require('fs')
const errors = require('./errors')
const simctl = require('./ios/simctl')

require.asset = require('require-asset')

const driver = require.asset(
  '../prebuilds/ios-arm64-simulator/bare-test-driver',
  __filename
)

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

  const root = path.join(device.data, 'tmp', 'bare-test-driver')

  fs.mkdirSync(root, { recursive: true })

  const filename = path.join(root, `${bundle.id}.bundle`)

  fs.writeFileSync(filename, bundle.toBuffer())

  simctl.spawn(device.id, driver, [filename], { stdio: 'inherit' })
}
