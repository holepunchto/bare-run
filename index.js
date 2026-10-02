const { find } = require('bare-device')
const runtime = require('#runtime')
const errors = require('./lib/errors')
const build = require('./lib/build')

module.exports = async function run(entry, opts = {}) {
  const { host = runtime.host, device: name = null, lowPower = false, doze = false } = opts

  const [platform] = host.split('-', 1)

  let device
  try {
    device = await find({ platform, name })
  } catch (err) {
    throw errors.UNKNOWN_DEVICE(err.message)
  }

  // This machine can run more than its own host, such as `darwin-x64` under
  // Rosetta, so only another device decides what to build for.
  const { executable, destroy } = await build(
    entry,
    device.kind === 'local' ? host : device.host,
    opts
  )

  let result

  // What low power mode was set to before. A setting that was never written
  // reads as `null` and means off, and Android writes it of its own accord once
  // power is reconnected, so it is restored as off.
  let previous = null

  if (lowPower) {
    previous = (await device.shell('settings', ['get', 'global', 'low_power'])).trim()

    if (previous === 'null') previous = '0'
  }

  try {
    if (lowPower) {
      await device.shell('dumpsys', ['battery', 'unplug'])
      await device.shell('settings', ['put', 'global', 'low_power', '1'])
    }

    if (doze) {
      await device.shell('dumpsys', ['deviceidle', 'force-idle'])
    }

    const child = await device.spawn(executable, [], { stdio: 'inherit' })

    result = await child.exited

    await child.close()
  } finally {
    destroy()

    if (lowPower || doze) {
      await device.shell('dumpsys', ['battery', 'reset'])
    }

    // Reconnecting power turns low power mode off, so it is restored after.
    if (lowPower) {
      await device.shell('settings', ['put', 'global', 'low_power', previous])
    }

    if (doze) {
      await device.shell('dumpsys', ['deviceidle', 'unforce'])
    }
  }

  if (result.signal) throw errors.PROCESS_KILLED(result.signal)
  if (result.code !== 0) throw errors.PROCESS_FAILED(result.code)
}
