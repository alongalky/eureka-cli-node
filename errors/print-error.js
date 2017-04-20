const chalk = require('chalk')

module.exports = err => {
  let message = ''
  if (err.response) {
    switch (err.response.status) {
      case 401:
        message = err.response.data.message
        break
      case 404:
      case 422:
        message = err.response.data
        break
      default:
        message = 'Internal Eureka server error'
    }
  } else if (err.errno === 'ECONNREFUSED') {
    message = `Failed to connect to Eureka server at: ${chalk.blue(err.address)}`
  } else {
    message = chalk.blue('Unkown error. Please contact Eureka support and provide the following error information:') +
      err.toString()
  }

  console.log(chalk.red('ERROR'), message)
}
