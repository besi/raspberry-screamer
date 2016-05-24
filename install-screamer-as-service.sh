#!/bin/sh
sudo cp ./autostart-screamer.sh /etc/init.d/screamer
sudo update-rc.d -f screamer remove
sudo update-rc.d screamer defaults