#!/bin/bash

git config --global user.email "muvucaserver@muvucagames.com"
git config --global user.name "Muvuca Server"

./node_modules/.bin/gh-pages \
  --silent \
  --dist $1 \
  --repo $2 \
  --branch $3
