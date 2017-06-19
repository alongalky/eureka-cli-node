const url = require('url')

module.exports = ({get, post, put, config}) => {
  const address = url.resolve(config.endpoint, `/api/accounts/${config.account}/tasks`)

  return {
    getTasks: () =>
      get(address)
        .then(response => response.data),

    runTask: ({machineName, command, workingDirectory, output, taskName, tier}) => {
      const body = {
        command,
        workingDirectory,
        output,
        machineName,
        taskName,
        tier
      }

      return post(address, body)
    },

    killTask: taskName => put(address, { task_name: taskName })
  }
}
