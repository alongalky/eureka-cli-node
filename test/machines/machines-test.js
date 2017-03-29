const sinon = require('sinon')
const machines = require('../../commands/machines/machines')
const assert = require('chai').assert
const config = {
  endpoint: 'http://fake.com'
}

describe('machines', () => {
  describe('getMachines', (done) => {
    const get = sinon.stub()
    const getMachines = machines({get, config}).getMachines

    beforeEach(() => {
      get.reset()
      get.returns(Promise.resolve({}))
    })

    it('returns the response body', done => {
      const expectedResponse = {that: 'works'}
      get.returns(Promise.resolve({data: expectedResponse}))

      getMachines()
        .then(response => {
          assert(get.calledOnce)
          assert.equal(response, expectedResponse)

          done()
        }).catch(err => done(err))
    })
    it('calls the correct url', done => {
      const expectedUrl = 'http://fake.com/api/machines'
      getMachines()
        .then(response => {
          sinon.assert.calledWith(get, expectedUrl)
          done()
        }).catch(err => done(err))
    })
  })
})
