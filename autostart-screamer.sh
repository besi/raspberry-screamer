#!/bin/sh
#
# cp ./autostart-screamer.sh /etc/init.d/screamer
# sudo update-rc.d -f screamer remove
# sudo update-rc.d screamer defaults
#
#
# init script for screamer
#

### BEGIN INIT INFO
# Provides:          screamer
# Required-Start:    $remote_fs $local_fs $syslog
# Required-Stop:     $remote_fs $local_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the screamer service
# Description:       Starts the screamer service with forever
### END INIT INFO

test -f $DAEMON || exit 0



# TODO: it seems to run with the wrong version of node js
# maybe sudo -u pi 
#sudo -iu pi

su - pi
echo $PATH
export PATH=/home/pi/.nvm/versions/node/v6.2.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
echo $PATH
cd /home/pi/screamer/
whoami
pwd
nvm --version

case "$1" in
    start)
        ./eventhandler/node_modules/forever/bin/forever start ./forever-config.json
        ;;
    stop)
        ./eventhandler/node_modules/forever/bin/forever stopall
        ;;
    restart)
        ./eventhandler/node_modules/forever/bin/forever restartall
        ;;
    status)
        ./eventhandler/node_modules/forever/bin/forever list
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 2
        ;;
esac

exit 0