#!/usr/bin/env node
const { command, arg, flag, summary } = require('paparam')
const pkg = require('./package')
const runtime = require('#runtime')
const run = require('.')

const cmd = command(
  pkg.name,
  summary(pkg.description),
  arg('<entry>', 'The entry point of the module graph'),
  flag('--version|-v', 'Print the current version'),
  flag('--base <path>', 'The base path of the bundle'),
  flag('--host <host>', 'The host to bundle for'),
  flag('--device|-d <name>', 'The name of the device to launch'),
  flag('--low-power', 'Set phone to Low Power conditions, Android only'),
  flag('--doze', 'Set phone to Doze mode, Android only'),
  async (cmd) => {
    const { entry } = cmd.args
    const { version, base, host, device, lowPower, doze } = cmd.flags

    if (version) return console.log(`v${pkg.version}`)

    try {
      await run(entry, { base, host, device, lowPower, doze })
    } catch (err) {
      if (err.status === undefined) throw err

      runtime.exitCode = err.status
    }
  }
)

cmd.parse()
