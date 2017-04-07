const url = require('url')
const querystring = require('querystring')

module.exports = ({get, put, config}) => {
  const address = url.resolve(config.endpoint, `/api/accounts/${config.account}/tasks`)

  return {
    getTasks: machine =>
      get(address, querystring.stringify({machine: machine && machine.id}))
        .then(response => response.data),

    runTask: ({machine, command, output, taskName, tier}) => {
      const body = {
        command,
        output,
        machine,
        taskName,
        tier
      }

      return put(address, body)
        .then(response => 'Response: Task queued successfully')
    }
  }
}
