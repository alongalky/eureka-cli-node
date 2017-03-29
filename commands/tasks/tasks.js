const axios = require('axios')
const url = require('url')
const querystring = require('querystring')
const config = require('../../eureka.config')

module.exports = {
  getTasks: machine =>
    axios.get(url.resolve(config.endpoint, '/api/tasks'), querystring.stringify({machine: machine && machine.id}))
      .then(response => response.data),

  runTask: ({machine, command, output}) => {
    console.log(`Running ${machine} with command ${'"' + command.join(' ') + '"'}, output folder is ${output}`)

    const body = {
      command,
      output
    }

    let address = url.resolve(config.endpoint, '/api/tasks/' + machine)
    return axios.put(address, body)
      .then(response => 'Response: Task queued successfully')
  }
}
