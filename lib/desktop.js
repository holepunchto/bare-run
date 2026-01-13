const path = require('path')
const fs = require('fs')
const os = require('os')
const runtime = require('#runtime')
const prebuilds = require('./prebuilds')
const spawn = require('./spawn')

exports.run = async function run(bundle, opts) {
  const { host = runtime.host } = opts

  const root = path.join(os.tmpdir(), 'bare-run')
  fs.mkdirSync(root, { recursive: true })

  const filename = path.join(root, `${bundle.id}.bundle`)
  fs.writeFileSync(filename, bundle.toBuffer())

  spawn(prebuilds[host](), [filename], { stdio: 'inherit' })

  fs.rmSync(filename)
}
