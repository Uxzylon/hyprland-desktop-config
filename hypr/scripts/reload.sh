#!/bin/bash

ags quit

sleep 0.5

hyprctl reload
ags run
