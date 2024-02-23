#!/bin/bash

number=$1

json=$(hyprctl activeworkspace -j)
id=$(echo "$json" | jq -r '.id')

if [[ $id -ge 1 && $id -le 999 ]]; then
  echo $number
elif [[ $id -ge 1000 ]]; then
  echo $((number + ($id / 1000) * 1000))
fi
