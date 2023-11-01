#!/usr/bin/env bash

rotation=$(hyprctl monitors | grep transform | awk '{print $2}')

if [ "$rotation" = "0" ] ; then
    hyprctl keyword monitor eDP-1,preferred,auto,1,transform,1
    hyprctl keyword input:touchdevice:transform 1
    hyprctl keyword input:tablet:transform 1
else
    hyprctl keyword monitor eDP-1,preferred,auto,1
    hyprctl keyword input:touchdevice:transform 0
    hyprctl keyword input:tablet:transform 0
fi
