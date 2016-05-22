#! /bin/sh
mkdir -p ./outgoing
mkdir -p ./incoming
mkdir -p ./checked
mkdir -p ./failed
mkdir -p ./stats
mkdir -p ./played

./eventhandler/node_modules/forever/bin/forever start forever-config.json