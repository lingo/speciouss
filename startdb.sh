#!/bin/bash
PORT=27017
DIR="$(readlink -f $(dirname $0))"
DATADIR="/tmp/mongodata"
mkdir $DATADIR
docker run --name mongo -v $DATADIR:/data/db -p $PORT:$PORT -d mongo
