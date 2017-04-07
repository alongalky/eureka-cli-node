const url = require('url')

module.exports = ({get, config}) => ({
  getMachines: () =>
    get(url.resolve(config.endpoint, `/api/accounts/${config.account}/machines`))
      .then(response => response.data)
})
