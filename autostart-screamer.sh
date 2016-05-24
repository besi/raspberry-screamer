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

cd /home/pi/screamer/
sudo su pi

case "$1" in
    start)
        exec ./eventhandler/node_modules/forever/bin/forever start ./forever-config.json
        ;;
    stop)
        exec ./eventhandler/node_modules/forever/bin/forever stopall
        ;;
    restart)
        exec ./eventhandler/node_modules/forever/bin/forever restartall
        ;;
    status)
        exec ./eventhandler/node_modules/forever/bin/forever list
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 2
        ;;
esac

exit 0