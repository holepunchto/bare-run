const process = require('process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const prebuilds = require('./prebuilds')
const spawn = require('./spawn')

exports.run = async function run(bundle, opts) {
  const { arch = process.arch, platform = process.platform } = opts

  const root = path.join(os.tmpdir(), 'bare-run')
  fs.mkdirSync(root, { recursive: true })

  const filename = path.join(root, `${bundle.id}.bundle`)
  fs.writeFileSync(filename, bundle.toBuffer())

  spawn(prebuilds[`${platform}-${arch}`](), [filename], {
    stdio: 'inherit'
  })
}
