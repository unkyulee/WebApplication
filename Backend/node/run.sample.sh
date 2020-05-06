#!/bin/bash
export PORT=8000
export BIND_IP=localhost
export DATABASE_URI=mongodb://localhost
export SECRET=DEVTEST
export DB=web
export TASK=10

node index.js