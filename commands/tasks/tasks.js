const url = require('url')

module.exports = ({get, post, config}) => {
  const address = url.resolve(config.endpoint, `/api/accounts/${config.account}/tasks`)

  return {
    getTasks: () =>
      get(address)
        .then(response => response.data),

    runTask: ({machineName, command, output, taskName, tier}) => {
      const body = {
        command,
        output,
        machineName,
        taskName,
        tier
      }

      return post(address, body)
        .then(response => 'Response: Task queued successfully')
    }
  }
}
