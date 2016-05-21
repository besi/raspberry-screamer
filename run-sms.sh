#! /bin/sh

mkdir -p /home/pi/screamer/sent
mkdir -p /home/pi/screamer/outgoing
mkdir -p /home/pi/screamer/incoming
mkdir -p /home/pi/screamer/checked
mkdir -p /home/pi/screamer/failed
mkdir -p /home/pi/screamer/stats

/usr/sbin/smsd -t -nMAINPROCESS -c/home/pi/screamer/smsd.conf
