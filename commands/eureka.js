#!/usr/bin/env node

const program = require('commander')

program
  .version('0.0.1')
  .command('tasks', 'Get running tasks')
  .command('machines', 'Get all machines')
  .command('run', 'Run a command')
  .parse(process.argv)
