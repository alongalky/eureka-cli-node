# Eureka CLI
This is the CLI interface for Eureka, written in Node.js.

## Installation
Clone the repo, and run `npm install -g`. This will make the `eureka` command available from your shell. To test, run:
```bash
eureka status
```

## Development set up
During development, if you want to use the local `eureka` commands instead of the ones installed globally, run: 
```bash
npm link
```
This will remain in effect until you run `npm unlink`.