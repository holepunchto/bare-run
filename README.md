# bare-run

Cross-platform script runner for Bare.

```
npm i [-g] bare-run
```

## CLI Usage

The `bare-run` command-line interface allows you to run JavaScript modules across different platforms.

### Basic Usage

```bash
bare-run <entry>
```

### Options

- `<entry>` - The entry point of the module graph (required)
- `--version, -v` - Print the current version
- `--base <path>` - The base path of the bundle (default: current directory)
- `--platform, -p <name>` - The operating system platform to bundle for (default: current platform)
- `--arch, -a <name>` - The operating system architecture to bundle for (default: current architecture)
- `--device, -d <name>` - The name of the device to launch (for mobile platforms)

### Examples

```bash
# Run a basic JavaScript file
bare-run index.js

# Run with specific platform and architecture
bare-run app.js --platform android --arch arm64

# Run with custom base path
bare-run src/main.js --base /path/to/project

# Run on specific iOS device
bare-run app.js --platform ios --device "iPhone 15"
```

## API

The `bare-run` module provides a programmatic API for running JavaScript bundles across different platforms.

### Import

```javascript
const run = require('bare-run')
```

### `run(entry, options)`

Runs a JavaScript module at the specified entry point.

#### Parameters

- `entry` (string) - The entry point file path
- `options` (object, optional) - Configuration options
  - `base` (string, default: '.') - The base path of the bundle
  - `platform` (string, default: `process.platform`) - Target platform ('android', 'ios', 'darwin', 'win32', 'linux')
  - `arch` (string, default: `process.arch`) - Target architecture ('arm64', 'x64', 'arm', 'ia32')
  - `device` (string, optional) - Device name for mobile platforms

#### Returns

Returns a Promise that resolves when the bundle execution completes.

#### Example

```javascript
const run = require('bare-run')

try {
  await run('./src/app.js', {
    platform: 'android',
    arch: 'arm64',
    device: 'Pixel_7'
  })
} catch (error) {
  console.error('Failed to run:', error)
}
```

### Supported Platforms

- **Android**: Runs on Android devices and emulators
- **iOS**: Runs on iOS simulators and devices
- **Desktop**: Runs on Windows, macOS, and Linux

## License

Apache-2.0
