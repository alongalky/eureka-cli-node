# Eureka CLI
This is the CLI interface for Eureka, written in Node.js.

## Overview
### Eureka?
[Eureka](http://eureka.guru) is a platform for deploying CPU heavy tasks quickly and painlessly on the cloud. It is currently in early Beta stages. If you wish to try it out, don't hesitate to [contact us](alon+andrea@eureka.guru).

### Main idea
When joining Eureka, you are given control over a cloud virtual machine (through SSH). You can install your code on it, compile it, and test it.

Once you are happy with your environment, you may run the [eureka-run](#commands) command. This will create a beefier version of your machine, run your command, backup the results, and terminate the new machine when done.

## Install
1. Install [Node](https://nodejs.org/). Make sure it works by running `npm --version` in a terminal.
1. Run `npm install -g eureka-cli`. Test the installation by running `eureka --version`.
1. During on-boarding, you should receive a configuration file called `eureka.config.yaml`. Copy it to the following location:

    * _Windows_: `C:\Users\YourUserName\.eureka\eureka.config.yaml`
    * _Linux/Mac_: `~/eureka/eureka.config.yaml`
1. Run `eureka machines`. You should see your assigned machine(s) names and SSH address.

## Commands
There are currently 3 supported commands:
1. `eureka tasks`: List your tasks.

1. `eureka machines`: List your machines, along with their SSH information.

1. `eureka run [--tier <tier>] <machine> <command>`
     
     This command will duplicate the requested `<machine>` and run the given `<command>` on it. 

     You may also provide a `<tier>` arguments, to specify the size of the machine to clone. For available options see [tiers](./docs/tiers.MD).

1. `eureka kill <task-name>`

     This command will kill a running or initializing task.

### Watch the logs
Unless specified otherwise in the command issued to `eureka run`, Eureka will redirect output and errors streams of each task to a dedicated file under `/keep/eureka-logs`.
Eureka makes sure that the tasks flushes to the logfiles at least every 10 seconds.

## Example usage

`eureka run --tier n1-standard-4 my_python_machine "python /bin/run_sim.py > /keep/output1.txt"`

This will clone `my_python_machine` into a new machine of tier `n1-standard-4`, run the command `/bin/run_sim.py`, and terminate the new machine.

## `/keep` your results!
When you `eureka run`, a whole new machine is started, and killed at the end of the task. All your output files should be stored in a special directory called `/keep`, as this is the _only_ directory that is not deleted when the task finishes. 

The `/keep` folder is shared among all machines you own. It will be visible in your SSH session, which is how you can access your output.

## Pricing
Eureka charges by the minute for `eureka run` usage. The machine your are given SSH access to is free to use, but is not very powerful, and is meant for development purposes.

See a list of supported tiers [here](./docs/tiers.MD).

## Contribute
See the [Contribute](./docs/contribute.MD) page for information on setting up development environment and code policy.
