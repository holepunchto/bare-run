const path = require('path')
const os = require('os')
const env = require('#env')

exports.path = env.ANDROID_HOME || path.join(os.homedir(), '.android/sdk')
