const path = require('path')
const os = require('os')
const which = require('bare-which')
const spawn = require('../spawn')
const sdk = require('./sdk')

function adb() {
  return which.sync('adb', {
    path: path.join(sdk.path, 'platform-tools')
  })
}

module.exports = exports = adb

exports.devices = function devices(opts = {}) {
  const lines = spawn(adb(), ['devices', '-l'], opts)
    .stdout.toString()
    .split(os.EOL)
    .filter(Boolean)
    .slice(1) // Skip header

  const devices = []

  for (const line of lines) {
    const [id, kind] = line.split(/[\s,]+/).filter(Boolean)

    if (kind !== 'device') continue

    const type = id.startsWith('emulator-') ? 'emulator' : 'device'

    devices.push({
      id,
      type,
      name: name(id, { type }),
      arch: arch(id),
      state: 'booted'
    })
  }

  return devices
}

exports.push = function push(device, local, remote, opts = {}) {
  if (device === 'number') device = `emulator-${device}`

  spawn(adb(), ['-s', device, 'push', local, remote], opts)
}

exports.shell = function shell(device, command, args = [], opts = {}) {
  if (device === 'number') device = `emulator-${device}`

  spawn(adb(), ['-s', device, 'shell', command, ...args], opts)
}

function name(device, opts = {}) {
  const { type = 'emulator' } = opts

  if (typeof device === 'number') device = `emulator-${device}`

  let name

  switch (type) {
    case 'device':
      ;[name] = spawn(adb(), ['-s', device, 'shell', 'getprop', 'ro.product.model'], opts)
        .stdout.toString()
        .split(os.EOL)
      break
    case 'emulator':
      ;[name] = exec(adb(), ['-s', device, 'emu', 'avd', 'name'], opts)
        .stdout.toString()
        .split(os.EOL)
      break
  }

  return name.trim()
}

function arch(device, opts = {}) {
  if (typeof device === 'number') device = `emulator-${device}`

  const [abi] = spawn(adb(), ['-s', device, 'shell', 'getprop', 'ro.product.cpu.abi'], opts)
    .stdout.toString()
    .split(os.EOL)

  switch (abi) {
    case 'armeabi-v7a':
      return 'arm'
    case 'arm64-v8a':
      return 'arm64'
    case 'x86':
      return 'ia32'
    case 'x86_64':
      return 'x64'
    default:
      return null
  }
}
