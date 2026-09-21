const { pathToFileURL } = require('url')
const { resolve } = require('bare-module-traverse')
const id = require('bare-bundle-id')
const pack = require('bare-pack')
const { readModule, listPrefix } = require('bare-pack/fs')
const runtime = require('#runtime')

const errors = require('./lib/errors')
const android = require('./lib/android')
const ios = require('./lib/ios')
const desktop = require('./lib/desktop')

module.exports = async function run(entry, opts = {}) {
  const { base = '.', host = runtime.host } = opts

  let bundle = await pack(
    pathToFileURL(entry),
    {
      host,
      resolve: resolve.bare
    },
    readModule,
    listPrefix
  )

  bundle = bundle.unmount(pathToFileURL(base))

  bundle.id = id(bundle).toString('hex')

  const [platform] = host.split('-', 1)

  let result

  switch (platform) {
    case 'android':
      result = await android.run(bundle, opts)
      break
    case 'ios':
      result = await ios.run(bundle, opts)
      break
    default:
      result = await desktop.run(bundle, opts)
  }

  if (result.signal) throw errors.PROCESS_KILLED(result.signal)
  if (result.status !== 0) throw errors.PROCESS_FAILED(result.status)
}
