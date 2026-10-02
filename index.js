const runtime = require('#runtime')

const errors = require('./lib/errors')
const android = require('./lib/android')
const ios = require('./lib/ios')
const desktop = require('./lib/desktop')

module.exports = async function run(entry, opts = {}) {
  const { host = runtime.host } = opts

  const [platform] = host.split('-', 1)

  let result

  switch (platform) {
    case 'android':
      result = await android.run(entry, opts)
      break
    case 'ios':
      result = await ios.run(entry, opts)
      break
    default:
      result = await desktop.run(entry, opts)
  }

  if (result.signal) throw errors.PROCESS_KILLED(result.signal)
  if (result.status !== 0) throw errors.PROCESS_FAILED(result.status)
}
