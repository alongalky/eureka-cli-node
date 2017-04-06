const sinon = require('sinon')
const keys = require('../../commands/keys/keys')
const assert = require('chai').assert

describe('keys', () => {
  describe('getKeys', (done) => {
    const fs = {
      existsSync: sinon.stub(),
      readFileSync: sinon.stub()
    }

    beforeEach(() => {
      fs.existsSync.reset()
      fs.readFileSync.reset()
    })

    it('returns {key, secret} when arguments are given', done => {
      const args = {key: 'key1', secret: 'topsec'}

      keys({fs}).getKeys(args).then(result => {
        assert.deepEqual(result, args)
        done()
      })
    })
    it('parses file when arguments not given and file exists', done => {
      const args = {key: 'key1', secret: 'topsec'}
      fs.existsSync.returns(true)
      fs.readFileSync.returns(JSON.stringify(args))

      keys({fs}).getKeys({}).then(result => {
        assert(fs.existsSync.calledOnce)
        assert(fs.readFileSync.calledOnce)
        assert.deepEqual(result, args)
        done()
      }).catch(err => done(err))
    })
    it('rejects with error when file does not exist', done => {
      fs.existsSync.returns(false)

      keys({fs}).getKeys({}).then(result => {
        assert.fail()
      }).catch(err => {
        assert(fs.existsSync.calledOnce)
        assert(fs.readFileSync.notCalled)
        assert.isNotNull(err)
        done()
      }).catch(err => done(err))
    })
  })
})

