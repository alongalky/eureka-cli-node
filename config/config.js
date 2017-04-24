const os = require('os')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const chalk = require('chalk')

const defaultFullPath = path.join(os.homedir(), '.eureka', 'eureka.config.yaml')
const filename = process.env.EUREKA_CONFIG || defaultFullPath

try {
  if (!fs.existsSync(filename)) {
    throw new Error(`Missing Eureka configuration file in ${filename}. Please contact Eureka team for on-boarding instructions`)
  }

  const data = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
  module.exports = data
} catch (err) {
  const prefix = chalk.red('ERROR') + ` cannot read config file from ${chalk.blue(filename)}`
  if (err.mark) {
    // YAML parse error
    const location = `line ${err.mark.line}, column ${err.mark.column}`
    console.log(prefix + `. Issue with ${location}`)
  } else {
    console.log(prefix + `\nError message is:`, err.message)
  }
  process.exit()
}
