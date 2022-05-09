#!/bin/bash
pgrep -f K2S_Server | awk '{print "kill " $1}' | sh