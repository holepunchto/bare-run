const which = require('bare-which')
const spawn = require('../spawn')
const xcrun = require('./xcrun')

function simctl() {
  return xcrun.find('simctl')
}

module.exports = exports = simctl

exports.list = function list(opts) {
  const json = JSON.parse(
    spawn(
      simctl(),
      ['list', '--json', '--no-escape-slashes', 'devices', 'available'],
      opts
    ).stdout.toString()
  )

  return Object.values(json.devices).flatMap((devices) =>
    devices.map((device) => {
      return {
        id: device.udid,
        name: device.name,
        state: device.state.toLowerCase(),
        data: device.dataPath
      }
    })
  )
}

exports.launch = function launch(device, opts = {}) {
  const { open = false } = opts

  spawn(simctl(), ['boot', device], opts)

  if (open) {
    spawn(which.sync('open'), ['-a', 'Simulator.app'], opts)
  }
}
