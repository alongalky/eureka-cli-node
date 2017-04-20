const os = require('os')
const path = require('path')
const axios = require('axios')

const tokenFileName = path.join(os.homedir(), '.eureka', '.eureka.tok')

module.exports = ({ fs, config }) => {
  const readTokenFile = () => {
    if (fs.existsSync(tokenFileName)) {
      const token = fs.readFileSync(tokenFileName) || ''
      return token.toString()
    } else {
      return null
    }
  }

  const writeTokenFile = token => {
    fs.writeFile(tokenFileName, token, err => {
      if (err) {
        console.error(`Failed to write token file into ${tokenFileName}`)
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
    if (error.response && error.response.status === 401 && attemptCount <= 1) {
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

  axiosAuth.resetAttemptCount = () => { attemptCount = 0 }

  return axiosAuth
}
