const test = require('brittle')
const run = require('.')

const isDarwin = Bare.platform === 'darwin'
const isLinux = Bare.platform === 'linux'
const isWindows = Bare.platform === 'win32'

test('ios', { skip: !isDarwin }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    platform: 'ios'
  })
})

test('android', { skip: !isDarwin && !isLinux }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    platform: 'android'
  })
})

test('darwin', { skip: !isDarwin }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    platform: 'darwin'
  })
})
