const process = require('process')
const { pathToFileURL } = require('url')
const { resolve } = require('bare-module-traverse')
const id = require('bare-bundle-id')
const pack = require('bare-pack')
const fs = require('bare-pack/fs')
const android = require('./lib/android')
const ios = require('./lib/ios')

module.exports = async function run(entry, opts = {}) {
  const { base = '.', platform = process.platform, arch = process.arch } = opts

  let bundle = await pack(
    pathToFileURL(entry),
    {
      platform,
      arch,
      simulator: platform === 'ios',
      resolve: resolve.bare
    },
    fs.readModule,
    fs.listPrefix
  )

  bundle = bundle.unmount(pathToFileURL(base))

  bundle.id = id(bundle).toString('hex')

  switch (platform) {
    case 'android':
      return android.run(bundle, opts)
    case 'ios':
      return ios.run(bundle, opts)
  }
}
