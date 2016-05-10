#!/bin/bash

eval "$(ssh-agent -s)"

echo ssh-add "$1"
