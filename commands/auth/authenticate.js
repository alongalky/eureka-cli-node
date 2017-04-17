const url = require('url')

module.exports = ({ post, config }) => () =>
  post(url.resolve(config.endpoint, '/api/authenticate'), {
    key: config.key,
    secret: config.secret,
    account_id: config.account
  }).then(response => response.data.token)
