const url = require('url')

module.exports = ({get, post, put, config}) => {
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
    },

    killTask: taskName => {
      return put(address, { task_name: taskName })
        .then(response => 'Response: Task killed successfully')
    }
  }
}
