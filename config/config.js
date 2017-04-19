const os = require('os')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const defaultFullPath = path.join(os.homedir(), '.eureka', 'eureka.config.yaml')
const filename = process.env.EUREKA_CONFIG || defaultFullPath

if (!fs.existsSync(filename)) {
  throw new Error(`Missing Eureka configuration file in ${filename}. Please contact Eureka team for on-boarding instructions`)
}

const data = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))

module.exports = data
