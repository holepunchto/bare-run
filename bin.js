#!/usr/bin/env node
const { command, arg, flag, summary } = require('paparam')
const pkg = require('./package')
const run = require('.')

const cmd = command(
  pkg.name,
  summary(pkg.description),
  arg('<entry>', 'The entry point of the module graph'),
  flag('--version|-v', 'Print the current version'),
  flag('--base <path>', 'The base path of the bundle'),
  flag('--platform|-p <name>', 'The operating system platform to bundle for'),
  flag('--arch|-a <name>', 'The operating system architecture to bundle for'),
  flag('--device|-d <name>', 'The name of the device to launch'),
  async (cmd) => {
    const { entry } = cmd.args
    const { version, base, platform, arch, device } = cmd.flags

    if (version) return console.log(`v${pkg.version}`)

    await run(entry, { base, platform, arch, device })
  }
)

cmd.parse()
