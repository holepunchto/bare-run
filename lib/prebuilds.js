const fs = require('fs')

require.asset = require('require-asset')

exports['ios-arm64-simulator'] = () => {
  return executable(
    require.asset('../prebuilds/ios-arm64-simulator/bare-run', __filename)
  )
}

exports['ios-x64-simulator'] = () => {
  return executable(
    require.asset('../prebuilds/ios-x64-simulator/bare-run', __filename)
  )
}

exports['android-arm'] = () => {
  return executable(
    require.asset('../prebuilds/android-arm/bare-run', __filename)
  )
}

exports['android-arm64'] = () => {
  return executable(
    require.asset('../prebuilds/android-arm64/bare-run', __filename)
  )
}

exports['android-ia32'] = () => {
  return executable(
    require.asset('../prebuilds/android-ia32/bare-run', __filename)
  )
}

exports['android-x64'] = () => {
  return executable(
    require.asset('../prebuilds/android-x64/bare-run', __filename)
  )
}

exports['darwin-x64'] = () => {
  return executable(
    require.asset('../prebuilds/darwin-x64/bare-run', __filename)
  )
}

exports['darwin-arm64'] = () => {
  return executable(
    require.asset('../prebuilds/darwin-arm64/bare-run', __filename)
  )
}

exports['linux-x64'] = () => {
  return executable(
    require.asset('../prebuilds/linux-x64/bare-run', __filename)
  )
}

exports['linux-arm64'] = () => {
  return executable(
    require.asset('../prebuilds/linux-arm64/bare-run', __filename)
  )
}

exports['win32-x64'] = () => {
  return executable(
    require.asset('../prebuilds/win32-x64/bare-run.exe', __filename)
  )
}

exports['win32-arm64'] = () => {
  return executable(
    require.asset('../prebuilds/win32-arm64/bare-run.exe', __filename)
  )
}

function executable(file) {
  try {
    fs.accessSync(file, fs.constants.X_OK)
  } catch {
    fs.chmodSync(file, 0o755)
  }

  return file
}
