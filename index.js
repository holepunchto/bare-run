const { pathToFileURL } = require('url')
const { resolve } = require('bare-module-traverse')
const id = require('bare-bundle-id')
const pack = require('bare-pack')
const { readModule, listPrefix } = require('bare-pack/fs')
const runtime = require('#runtime')

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

  switch (platform) {
    case 'android':
      return android.run(bundle, opts)
    case 'ios':
      return ios.run(bundle, opts)
    default:
      return desktop.run(bundle, opts)
  }
}
