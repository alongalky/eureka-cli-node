const path = require('path')

const defaultConfigFilePath = path.join(process.cwd(), 'eureka.credentials.json')
const defaultErrorMessage = 'Must provide valid Key / Secret pair, either in command line or eureka.credentials.json file'

module.exports = ({fs}) => ({
  getKeys: ({key, secret, configFilePath = defaultConfigFilePath}) => {
    // First check command line arguments
    if (key && secret) {
      return Promise.resolve({key, secret})
    } else if (key || secret) {
      return Promise.reject(defaultErrorMessage)
    }

    // Then check configuration file
    if (fs.existsSync(configFilePath)) {
      const fileText = fs.readFileSync(configFilePath, 'utf8')
      const data = JSON.parse(fileText)

      if (data.key && data.secret) {
        return Promise.resolve({
          key: data.key,
          secret: data.secret
        })
      }
    }

    // Fail
    return Promise.reject(defaultErrorMessage)
  }
})
