#!/bin/bash
PORT=27017
docker run --name mongo -p $PORT:$PORT -d mongo
