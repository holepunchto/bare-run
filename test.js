const test = require('brittle')
const run = require('.')

test('ios', async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    platform: 'ios'
  })
})

test('android', async (t) => {
  await run(require.resolve('./test/fixtures/basic/index.js'), {
    platform: 'android'
  })
})
