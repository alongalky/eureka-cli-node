# eureka run
## Purpose
`eureka run [options] <command>` starts a new task. It triggers the following actions:
1. The current environment is saved.
2. A new machine is launched, with the same environment.
3. `<command>` is run on the new node, in the same directory `eureka run` was run from.

`eureka run` works the same as running the command locally, except the execution is remote.

We recommend wrapping the command in quotations marks (""), to avoid incorrect interpretation by the shell.

## Options
* `-n, --name <task name>`

   Specify a custom name for the task. If omitted, a random "silly name" will be given.

* `-t, --tier <tier name>`

   Specify a "tier", which sets the machine type for the task. If omitted, `n1-standard-1` is set by default. See [here](../tiers.MD) for available tiers.

## Getting output
### Output files
Eureka provides the `/keep` folder for output files, which is mounted storage. You may access this storage from your VM as well.

**All output files must be saved under `/keep`.** Only `/keep` is preserved after the task is done.

### Standard output
Standard error and output are written to `/keep/eureka-logs/logs-<task name>`. They are flushed every 10 seconds. We recommend using `watch -n 5 cat <output file>` to track ongoing output.

## Task termination
The task will be terminated on any of the following conditions:
1. The process has finished.
2. The task was killed using [`eureka kill`](kill.MD).
3. The balance in the user's account is zero.

## Examples
1. `eureka run "./myscript.sh"`

   Start a new task, running the "myscript.sh" script from the current working directory.

2. `eureka run --name cheetah --tier n1-standard-4 "python run_sim.py < /keep/cheetah_input"`

   Start a new task named "cheetah" on a 4-core machine, running the "run_sim.py" Python script, which takes the "/keep/cheetah_input" file as input.