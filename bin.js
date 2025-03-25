#!/usr/bin/env node

const { command, arg, flag, summary } = require('paparam')
const path = require('path')
const process = require('process')
const pkg = require('./package')
const test = require('.')

const cmd = command(
  pkg.name,
  summary(pkg.description),
  flag('--platform|-p <name>', 'The operating system platform to build for'),
  flag('--arch|-a <name>', 'The operating system architecture of the emulator'),
  flag('--device|-d <name>', 'The name of the device to launch'),
  flag('--simulator', 'Build for a simulator'),
  arg('<testfile>', 'The name of the test script to run'),
  () => {
    const { platform, arch, device, simulator } = cmd.flags
    const testfile = path.resolve(process.cwd(), cmd.args.testfile)

    test(testfile, { platform, arch, device, simulator })
  }
)

cmd.parse()
