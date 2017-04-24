const sinon = require('sinon')
const express = require('express')
const expect = require('chai').expect
var http = require('http')
const os = require('os')
const path = require('path')

describe('axios-authenticated', () => {
  const port = 5551
  const config = {
    endpoint: `http://localhost:${port}/`,
    key: 'Key',
    secret: 'secret',
    account: 'fake-account',
  }

  const getResponse = sinon.stub()
  const postResponseSuccess = sinon.stub()

  const fs = {
    existsSync: sinon.stub(),
    writeFile: sinon.stub(),
    readFile: sinon.stub()
  }

  const axiosAuth = require('../../commands/auth/axios-authenticated')({ config, fs })
  const app = express()
  const server = http.createServer(app)

  before(() => {
    app.get('/', (req, res) => {
      res.status(getResponse()).end()
    })
    app.post('/api/authenticate', (req, res) => {
      if (postResponseSuccess()) {
        res.json({token: 'great toke'})
      } else {
        res.status(400).end()
      }
    })

    server.listen(port)
  })

  after(() => {
    server.close()
  })

  beforeEach(() => {
    getResponse.reset()
    postResponseSuccess.reset()
    axiosAuth.resetAttemptCount()
    fs.writeFile.reset()
    postResponseSuccess.returns(true)
  })

  it('does not retry when response is 200', done => {
    getResponse.returns(200)

    axiosAuth
      .get(`http://localhost:${port}/`)
      .then(response => {
        expect(response.status).to.equal(200)
        sinon.assert.notCalled(fs.writeFile)

        sinon.assert.calledOnce(getResponse)

        done()
      }).catch(err => console.error(err))
  })
  it('retries once when response is 401', done => {
    getResponse.onFirstCall().returns(401)
    getResponse.onSecondCall().returns(200)
    const expectedTokenFileName = path.join(os.homedir(), '.eureka', '.eureka.tok')

    axiosAuth
      .get(`http://localhost:${port}/`)
      .then(response => {
        expect(response.status).to.equal(200)
        sinon.assert.calledOnce(fs.writeFile)
        sinon.assert.calledWith(fs.writeFile, expectedTokenFileName, 'great toke')
        sinon.assert.calledTwice(getResponse)

        done()
      })
  })
  it('fails after a receiving 401 once and failing authentication', done => {
    getResponse.onFirstCall().returns(401)
    postResponseSuccess.returns(false)

    axiosAuth
      .get(`http://localhost:${port}/`)
      .then(response => {
        expect.fail()
      }).catch(err => {
        sinon.assert.notCalled(fs.writeFile)
        sinon.assert.calledOnce(getResponse)
        sinon.assert.calledOnce(postResponseSuccess)

        expect(err.response.status).to.equal(400)
        done()
      })
  })
  it('does not retry when call fails with code != 401', done => {
    getResponse.onFirstCall().returns(404)

    axiosAuth
      .get(`http://localhost:${port}/`)
      .then(response => {
        expect.fail()
      }).catch(err => {
        sinon.assert.notCalled(fs.writeFile)
        sinon.assert.calledOnce(getResponse)
        sinon.assert.notCalled(postResponseSuccess)

        expect(err.response.status).to.equal(404)
        done()
      })
  })
})

