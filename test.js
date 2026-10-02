const test = require('brittle')
const run = require('.')

const isDarwin = Bare.platform === 'darwin'
const isLinux = Bare.platform === 'linux'
const isWindows = Bare.platform === 'win32'

test.skip('ios', { skip: !isDarwin }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    host: `ios-${Bare.arch}-simulator`
  })
})

test.skip('android', { skip: !isDarwin && !isLinux }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    host: 'android-arm64'
  })
})

test('darwin', { skip: !isDarwin }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'))
})

test('linux', { skip: !isLinux }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'))
})

test('windows', { skip: !isWindows }, async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'))
})
