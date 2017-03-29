const url = require('url')
const querystring = require('querystring')

module.exports = ({get, put, config}) => ({
  getTasks: machine =>
    get(url.resolve(config.endpoint, '/api/tasks'), querystring.stringify({machine: machine && machine.id}))
      .then(response => response.data),

  runTask: ({machine, command, output}) => {
    const body = {
      command,
      output
    }

    let address = url.resolve(config.endpoint, '/api/tasks/' + machine)
    return put(address, body)
      .then(response => 'Response: Task queued successfully')
  }
})
