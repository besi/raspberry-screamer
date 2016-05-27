A Raspberry pi project that plays sounds when someone sends it a SMS.

####HARDWARE
- Raspberry Pi Zero 1.2
- Huawei E169 HSDPA Modem
- plexgear USB 2.0 hub
- Goobay model 68878 USB 3D Sound


####SOFTWARE USED
- nodejs 4.4.4
- smsd 3.1.15

###### install 
`sudo apt-get install libasound2-dev`
`sudo apt-get install smstools`
`sudo apt-get install alsa-utils`
`sudo apt-get install avconv`
`sudo apt-get install sox`

## Audio stuff
The usb sound card only supports 16 bit signed little endian audio so we need to convert to that.

On the mac install
`brew install vorbis-tools`
and to convert ogg to wav
`oggdec -b 16 -e -s -r -o output.wav input.ogg`

to do them all
`ls *.ogg | xargs oggdec -b 16 -e -s -r`

add
`snd-usb-audio` to `/etc/modules`

update `/etc/modprobe.d/alsa-base.conf` to
```
options snd-usb-audio index=0
options snd_bcm2835 index=1
```

update `~/.asoundrc` to
```
pcm.!default {
    type hw
    card 0
}

ctl.!default {
    type hw
    card 0
}
```

`lsub` should say
```
Bus 001 Device 005: ID 0d8c:000c C-Media Electronics, Inc. Audio Adapter
Bus 001 Device 004: ID 12d1:1436 Huawei Technologies Co., Ltd. E173 3G Modem (modem-mode)
Bus 001 Device 003: ID 0bda:8179 Realtek Semiconductor Corp.
Bus 001 Device 002: ID 1a40:0101 Terminus Technology Inc. 4-Port HUB
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

`aplay -l` should say
```
**** List of PLAYBACK Hardware Devices ****
card 0: Set [C-Media USB Headphone Set], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 1: ALSA [bcm2835 ALSA], device 0: bcm2835 ALSA [bcm2835 ALSA]
  Subdevices: 8/8
  Subdevice #0: subdevice #0
  Subdevice #1: subdevice #1
  Subdevice #2: subdevice #2
  Subdevice #3: subdevice #3
  Subdevice #4: subdevice #4
  Subdevice #5: subdevice #5
  Subdevice #6: subdevice #6
  Subdevice #7: subdevice #7
card 1: ALSA [bcm2835 ALSA], device 1: bcm2835 ALSA [bcm2835 IEC958/HDMI]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
  ```

https://wiki.archlinux.org/index.php/Advanced_Linux_Sound_Architecture/Troubleshooting

####START
To start the smsd process
`./start.sh`

####NOTES
- watch out with using usb hubs that are powered. You need to make sure it doesn't backpower since you'll fry your PI. I did.

####TODO

- [ ] make polling for messages less frequent
- [ ] Make logging less verbose
- [X] make both smsd and the watcher run as deamons
- [ ] make smsd and the watcher start on boot and something keeps it alive
- [X] remove played messages from incoming spool
- [X] return a confirmation when a message has been received
- [ ] update with proper sounds
- [ ] make the sounds overlap a bit

