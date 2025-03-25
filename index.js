const make = require('bare-make')
const os = require('os')
const path = require('path')
const process = require('process')
const subprocess = require('child_process')
const which = require('bare-which')

module.exports = function test(entry, opts) {
  if (opts.platform === 'android') android(entry, opts)
  else if (opts.platform === 'ios') ios(entry, opts)
  else desktop(entry, opts)
}

async function android(entry, opts) {
  const sdk =
    process.env.ANDROID_HOME || path.join(os.homedir(), '.android/sdk')
  const adb = which.sync('adb', { path: path.join(sdk, 'platform-tools') })

  await build(entry, opts)

  const deviceArgs = opts.device ? ['-s', opts.device] : []

  spawn(adb, [...deviceArgs, 'push', 'prebuilds/bin/test', '/data/bin/test'])

  spawn(
    adb,
    [...deviceArgs, 'shell', '/data/bin/test'],
    { stdio: 'inherit' },
    false
  )

  spawn(adb, [...deviceArgs, 'shell', 'rm', '/data/bin/test'])
}

async function ios(entry, opts) {
  const xcrun = which.sync('xcrun')

  const simctl = exec(xcrun, ['--find', 'simctl'], { stdio: 'pipe' })
    .toString()
    .trim()

  await build(entry, opts)

  spawn(
    simctl,
    ['spawn', opts.device, 'prebuilds/bin/test'],
    { stdio: 'inherit' },
    false
  )
}

function desktop(entry) {
  exec(which.sync('bare'), [entry], { stdio: 'inherit' }, false)
}

async function build(entry, opts = {}) {
  opts = { ...opts, cwd: __dirname }

  await make.generate({ define: [`TEST_FILE=${entry}`], ...opts })
  await make.build(opts)
  await make.install(opts)
}

function exec(file, args = [], opts = {}, throwError = true) {
  try {
    return subprocess.execFileSync(file, args, opts)
  } catch (err) {
    process.exitCode = 1
    if (throwError) throw err
  }
}

function spawn(cmd, args = [], opts = {}, throwError = true) {
  const proc = subprocess.spawnSync(cmd, args, opts)

  if (proc.status) {
    process.exitCode = 1
    if (throwError) throw new Error('spawn() failed')
  }
}
