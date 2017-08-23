# Frequently Asked Questions

* *How can I access Eureka?*

     Write an email to *alon [ at ] eureka.guru*, give us your name, and we'll reply shortly with login information.

* *Does Eureka support proprietary, commercially-licensed software?*

     Not yet. Supporting licensed software requires a lot of technical and legal overhead, and we're simply not at that stage yet. You are welcome to use your own code, or any open-source program.

* What machine sizes are available?

     You can find the list of available machines [here](tiers.MD). If you are interested in a custom size or a different core to RAM ratio, drop us a line and we'll set it up.

* Does Eureka own its own data center?

     No. Eureka is backed public cloud resources, currently Google Cloud.

* What happened to my output files?

     The most common reason for not finding your output files is not saving them into the `/keep` folder. You **must** save output files under the `/keep` folder. All other folders are lost when the task is finished.

     The standard output and error streams are saved into `/keep/eureka-logs` during every task run.


* Can I see ongoing output from a task?

     Yes. The standard output is flushed from the running machine every 10 seconds. Output files which are written into `/keep` by the task are synced continuously.
