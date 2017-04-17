const axios = require('axios')
const fs = require('fs')

module.exports = config => {
  const readTokenFile = () => {
    if (fs.existsSync(config.tokenfile)) {
      const token = fs.readFileSync(config.tokenfile) || ''
      return token.toString()
    } else {
      return null
    }
  }

  const writeTokenFile = token => {
    fs.writeFile(config.tokenfile, token, err => {
      if (err) {
        console.error(`Failed to write token file into ${config.tokenfile}`)
      }
    })
  }

  const axiosAuth = axios.create()
  const auth = require('./authenticate')({ post: axios.post, config })

  let interceptedRequestConfig = null
  let token = readTokenFile()
  let attemptCount = 0

  // Add authorization header to all requests
  axiosAuth.interceptors.request.use(config => {
    config.headers.Authorization = token
    interceptedRequestConfig = config
    attemptCount++

    return config
  }, error =>
    Promise.reject(error))

  // Retry once requests that failed with 401
  axiosAuth.interceptors.response.use(response => response, error => {
    if (error.response.status === 401 && attemptCount <= 1) {
      return auth().then(validToken => {
        token = validToken
        interceptedRequestConfig.headers.Authorization = validToken
        writeTokenFile(token)
        return axiosAuth(interceptedRequestConfig)
      })
    } else {
      return Promise.reject(error)
    }
  })

  return axiosAuth
}
