const sinon = require('sinon')
const tasks = require('../../commands/tasks/tasks')
const assert = require('chai').assert
const config = {
  endpoint: 'http://fake.com'
}

describe('tasks', () => {
  describe('getTasks', () => {
    const get = sinon.stub()
    const getTasks = tasks({get, config}).getTasks

    beforeEach(() => {
      get.reset()
      get.returns(Promise.resolve({}))
    })

    it('returns the response body', done => {
      const expectedResponse = {that: 'works'}
      get.returns(Promise.resolve({data: expectedResponse}))

      getTasks()
        .then(response => {
          assert(get.calledOnce)
          assert.equal(response, expectedResponse)

          done()
        }).catch(err => done(err))
    })
    it('calls the correct url', done => {
      const expectedUrl = 'http://fake.com/api/tasks'
      getTasks()
        .then(response => {
          sinon.assert.calledWith(get, expectedUrl)
          done()
        }).catch(err => done(err))
    })
  })
  describe('runTask', () => {
    const put = sinon.stub()
    const runTask = tasks({put, config}).runTask

    const args = ({
      machine: 'machina',
      command: [],
      output: ''
    })

    beforeEach(() => {
      put.reset()
      put.returns(Promise.resolve({}))
    })

    it('calls the correct url', done => {
      const expectedUrl = 'http://fake.com/api/tasks/machina'
      runTask(args)
        .then(response => {
          sinon.assert.calledWith(put, expectedUrl)
          done()
        }).catch(err => done(err))
    })
    it('returns success message on happy flow', done => {
      const expectedResponse = 'Response: Task queued successfully'
      runTask(args)
        .then(response => {
          assert.equal(response, expectedResponse)
          done()
        }).catch(err => done(err))
    })
  })
})
