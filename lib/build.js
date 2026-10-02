const path = require('path')
const fs = require('fs')
const os = require('os')
const build = require('bare-build')

module.exports = async function standalone(entry, host, opts = {}) {
  const { base = '.' } = opts

  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'bare-run-'))

  let executable = null

  for await (const resource of build(entry, {
    base,
    hosts: [host],
    out,
    standalone: true
  })) {
    executable = resource
  }

  return {
    executable,
    destroy() {
      fs.rmSync(out, { recursive: true, force: true })
    }
  }
}
