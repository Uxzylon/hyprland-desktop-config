#!/usr/bin/env bash

SIZE=$(hyprctl activewindow -j | jq -r ".size")
WIDTH=$(echo $SIZE | cut -d',' -f1 | cut -d'[' -f2)

if [[ $WIDTH -eq 1920 ]]; then
    hyprctl dispatch "resizeactive -30% -20%"
    hyprctl dispatch centerwindow
else
    hyprctl dispatch resizeactive exact 100% 1039
    hyprctl dispatch moveactive exact 0 41
fi