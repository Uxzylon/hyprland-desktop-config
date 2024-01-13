#!/bin/bash

_ps=(waybar mako dunst wofi swww)
for _prs in "${_ps[@]}"; do
	if [[ $(pidof ${_prs}) ]]; then
		killall -9 ${_prs}
	fi
done

hyperctl reload
dunst -conf $HOME/.config/dunst/dunstrc &
waybar --bar main-bar --log-level error --config $HOME/.config/waybar/config --style $HOME/.config/waybar/style.css &
swww init &
swww img $SWWW_WALLPAPER &
