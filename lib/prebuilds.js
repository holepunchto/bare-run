require.asset = require('require-asset')

exports['ios-arm64-simulator'] = () =>
  require.asset('../prebuilds/ios-arm64-simulator/bare-test-driver', __filename)

exports['ios-x64-simulator'] = () =>
  require.asset('../prebuilds/ios-x64-simulator/bare-test-driver', __filename)

exports['android-arm'] = () =>
  require.asset('../prebuilds/android-arm/bare-test-driver', __filename)

exports['android-arm64'] = () =>
  require.asset('../prebuilds/android-arm64/bare-test-driver', __filename)

exports['android-ia32'] = () =>
  require.asset('../prebuilds/android-ia32/bare-test-driver', __filename)

exports['android-x64'] = () =>
  require.asset('../prebuilds/android-x64/bare-test-driver', __filename)
