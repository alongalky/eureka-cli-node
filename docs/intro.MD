# Eureka
Welcome to Eureka, the on-demand queue-free cluster!

This document will give an overview of what Eureka is and how it can be used to run your scientific computations.

## Introduction
Eureka is a minimal-but-complete solution for running your computational tasks. It automates the following:
1. Launching a node for each task
2. Terminating each node when its task is done
3. Collecting output

To use Eureka, you need to set up your code in a virtual machine (VM) that we provide for you, via SSH access. All you need to do to get access is to email us (feel free to use a cool subject like "Give me some Eureka!", we'll appreciate that).

This VM contains the eureka command line interface (CLI), which is used to launch, kill, and monitor tasks. The most basic commands are:

1. [eureka run](commands/run.MD), used for launching tasks
2. [eureka tasks](commands/tasks.MD), used for seeing currently running tasks
3. [eureka kill](commands/kill.MD), used for terminating a task

## Launching your first task

We included a little Python script to calculate Pi using a Monte Carlo method. Inside the SSH shell, run:
```
    eureka run "python /examples/pi.py 8"
```
This will clone your machine and run the command. The "8" in the command means 10^8 iterations. Run `eureka tasks` to see the current status. It should take about 2 minutes for the machine to initialize. Standard output will go to `/keep/eureka-logs`.

## Moving files around

You can connect to Eureka using any SSH / SCP client you are comfortable with. We recommend the command line utilities for Linux, and WinSCP for Windows.

## Pricing

You can see the full pricing table [here](tiers.MD). The cost is roughly $0.055 cents per core hour. When setting up your account, we pre-charge with $100 that you can use to learn the system and run small calculations.

## Support

We want your time on Eureka to be fun and productive, and we are happy to provide you with email and phone support. We are also happy to help with any installations and setting up: just tell us what you need.

If you want to get an account and try out Eureka, write *alon@eureka.guru*. If you have technical issues or questions, write *andrea@eureka.guru*.
