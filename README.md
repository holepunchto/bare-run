# bare-run

Cross-platform script runner for Bare. It takes a bundled module graph and executes it on various platforms including desktop, Android, and iOS. Built on top of <https://github.com/holepunchto/bare-pack>, it provides platform-specific execution environments and device management.

A [CLI](#cli) is also included and provides out-of-the-box support for running JavaScript bundles across different platforms and architectures.

```
npm i [-g] bare-run
```

## Usage

```js
const run = require('bare-run')

try {
  await run('./src/app.js', {
    platform: 'android',
    arch: 'arm64',
    device: 'Pixel_7'
  })
  console.log('App started successfully')
} catch (error) {
  console.error('Failed to start app:', error)
}
```

## API

#### `const result = await run(entry[, options])`

Run a JavaScript module at the specified entry point. The function will automatically detect the platform and architecture if not specified, and handle the execution environment setup.

Parameters:

- `entry` (string) - The entry point file path
- `options` (object, optional) - Configuration options

Options include:

```js
options = {
  base: '.', // Base path for the bundle
  platform: process.platform, // Target platform
  arch: process.arch, // Target architecture
  device: undefined // Device name for mobile platforms
}
```

The function returns a Promise that resolves when the bundle execution completes.

### Supported Platforms

- **Android**: Runs on Android devices and emulators via ADB
- **iOS**: Runs on iOS simulators and devices via Xcode tools
- **Desktop**: Runs on Windows, macOS, and Linux natively

## CLI

#### `bare-run [flags] <entry>`

Run the module graph rooted at `<entry>` on the specified platform and architecture. The CLI automatically handles platform detection and execution environment setup.

Flags include:

```console
--version|-v           Print the current version
--base <path>          The base path of the bundle
--platform|-p <name>   The operating system platform to bundle for
--arch|-a <name>       The operating system architecture to bundle for
--device|-d <name>     The name of the device to launch
--low-power            Set phone to Low Power conditions, Android only
--doze                 Set phone to Doze mode, Android only
--help|-h              Show help
```

##### Basic Usage

```bash
# Run a basic JavaScript file
bare-run index.js

# Run with specific platform and architecture
bare-run app.js --platform android --arch arm64

# Run with custom base path
bare-run src/main.js --base /path/to/project
```

##### Platform Targeting

By default, the script will run on the host platform and architecture. To run on a different target system, use the `--platform` and `--arch` flags.

```console
bare-run --platform <darwin|ios|linux|android|win32> --arch <arm|arm64|ia32|x64> index.js
```

##### Device Selection

For mobile platforms, you can specify a target device using the `--device` flag.

```console
# Run on specific iOS device
bare-run app.js --platform ios --device "iPhone 15"

# Run on specific Android device
bare-run app.js --platform android --device "Pixel_7"
```

## License

Apache-2.0
