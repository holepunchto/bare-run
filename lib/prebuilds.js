require.asset = require('require-asset')

exports['ios-arm64-simulator'] = () =>
  require.asset('../prebuilds/ios-arm64-simulator/bare-test-driver', __filename)

exports['ios-x64-simulator'] = () =>
  require.asset('../prebuilds/ios-x64-simulator/bare-test-driver', __filename)
