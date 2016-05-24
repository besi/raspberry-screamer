#!/bin/sh
#
# init script for screamer
#

### BEGIN INIT INFO
# Provides:          ship-it
# Required-Start:    $remote_fs $local_fs $syslog
# Required-Stop:     $remote_fs $local_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the screamer service
# Description:       Starts the screamer service with forever
### END INIT INFO

test -f $DAEMON || exit 0

case "$1" in
    start)
        exec su - pi /home/pi/screamer/eventhandler/node_modules/forever/bin/forever start /home/pi/screamer/forever-config.json
        ;;
    stop)
        exec su - pi /home/pi/screamer/eventhandler/node_modules/forever/bin/forever stopall
        ;;
    restart)
        exec su - pi /home/pi/screamer/eventhandler/node_modules/forever/bin/forever restartall
        ;;
    status)
        exec su - pi /home/pi/screamer/eventhandler/node_modules/forever/bin/forever list
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 2
        ;;
esac

exit 0