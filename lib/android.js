const path = require('path')
const process = require('process')
const fs = require('fs')
const os = require('os')

const errors = require('./errors')
const prebuilds = require('./prebuilds')
const adb = require('./android/adb')

exports.run = async function run(bundle, opts) {
  let device = null

  const devices = await adb.list()
  if (devices.length === 0) {
    throw errors.UNKNOWN_DEVICE('No Android devices found. Make sure adb is running and devices are connected.')
  }

  for (const candidate of devices) {
    if (typeof opts.device === 'string') {
      if (candidate.name.toLowerCase().includes(opts.device.toLowerCase()) ||
          candidate.id.toLowerCase().includes(opts.device.toLowerCase())) {
        device = candidate
        break
      }
    } else if (candidate.state === 'device') {
      device = candidate
      break
    }
  }

  if (device === null) {
    throw errors.UNKNOWN_DEVICE('Could not find a suitable Android device')
  }

  const remoteDir = '/data/local/tmp/bare-test-driver'
  await adb.shell(device.id, `mkdir -p ${remoteDir}`, opts)

  const tmpFileName = path.join(os.tmpdir(), `${bundle.id}.bundle`)
  fs.writeFileSync(tmpFileName, bundle.toBuffer(), opts)

  const remoteBundlePath = path.join(remoteDir, `${bundle.id}.bundle`)
  await adb.push(device.id, tmpFileName, remoteBundlePath, { stdio: 'ignore' })

  let prebuildKey = `android-${opts.arch}`
  const prebuild = prebuilds[prebuildKey]
  if (!prebuild) {
    throw new Error(`No prebuild available for architecture: ${deviceArch}`)
  }

  await adb.push(device.id, prebuild(), remoteDir, { stdio: 'ignore'})

  const remoteDriver = path.join(remoteDir, 'bare-test-driver')
  await adb.shell(device.id, `${remoteDriver} ${remoteBundlePath}`, { stdio: 'inherit' })
}
