const axios = require('axios')

module.exports = keys => axios.create({
  headers: {
    Authentication: `${keys.key}:${keys.secret}`
  }
})
