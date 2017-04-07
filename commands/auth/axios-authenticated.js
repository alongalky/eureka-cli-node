const axios = require('axios')

module.exports = config => axios.create({
  headers: {
    Authentication: `${config.key}:${config.secret}`
  }
})
