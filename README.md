A Raspberry pi project that plays sounds when someone sends it a SMS.

####HARDWARE
- Raspberry Pi Zero 1.2
- Huawei E169 HSDPA Modem
- plexgear USB 2.0 hub


####SOFTWARE USED
- nodejs 4.4.4
- smsd 3.1.15

###### install 
`sudo apt-get install libasound2-dev`
`sudo apt-get install smstools`

####START
To start the smsd process
`./run-sms.sh`

####NOTES
- watch out with using usb hubs that are powered. You need to make sure it doesn't backpower since you'll fry your PI. I did.
- The "Goobay model 68878 USB 3D Sound" does not work with the Pi from my experience.

####TODO

- make polling for messages less frequent
- Make logging less verbose
- make both smsd and the watcher run as deamons
- make smsd and the watcher start on boot and something keeps it alive
- remove played messages from incoming spool
- return a confirmation when a message has been received
- update with proper sounds
- make the sounds overlap a bit

