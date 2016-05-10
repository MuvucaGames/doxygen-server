#!/bin/bash

eval "$(ssh-agent -s)"

ssh-add "ssh-add $1"
