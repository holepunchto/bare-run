const path = require('path')
const process = require('process')
const spawn = require('../spawn')
const sdk = require('./sdk')

function getAdbPath() {
  const platform = process.platform
  const adbName = platform === 'win32' ? 'adb.exe' : 'adb'
  return path.join(sdk.path, 'platform-tools', adbName)
}

function adb(args, options = {}) {
  const adbPath = getAdbPath()
  return spawn(adbPath, args, options).stdout?.toString()
}

function list() {
  const output = adb(['devices', '-l'])
  const lines = output.split('\n').filter(line => line.trim())
  const devices = []

  for (const line of lines) {
    if (line.includes('device') && !line.includes('List of devices')) {
      const parts = line.split(/\s+/)
      if (parts.length >= 2) {
        const id = parts[0]
        const state = parts[1]
        const props = parts.slice(2)

        const device = {
          id,
          state,
          name: '',
          model: '',
          product: ''
        }

        for (const prop of props) {
          if (prop.startsWith('model:')) {
            device.model = prop.split(':')[1]
          } else if (prop.startsWith('product:')) {
            device.product = prop.split(':')[1]
          }
        }

        device.name = device.model || device.product || id
        devices.push(device)
      }
    }
  }

  return devices
}

function push(localPath, remotePath, opts = {}) {
  return adb(['push', localPath, remotePath], opts)
}

function shell(deviceId, command, opts = {}) {
  return adb(['-s', deviceId, 'shell', command], opts)
}

module.exports = {
  list,
  push,
  shell
}
