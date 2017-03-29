const axios = require('axios')
const url = require('url')
const config = require('../../eureka.config')

module.exports = {
  getMachines: () =>
    axios.get(url.resolve(config.endpoint, '/api/machines'))
      .then(response => response.data)
}
