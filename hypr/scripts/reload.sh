#!/bin/bash

_ps=(waybar mako dunst wofi swww)
for _prs in "${_ps[@]}"; do
	if [[ $(pidof ${_prs}) ]]; then
		killall -9 ${_prs}
	fi
done
ags -b hypr -q
ags quit

hyprctl reload
#dunst -conf $HOME/.config/dunst/dunstrc &
#waybar --bar main-bar --log-level error --config $HOME/.config/waybar/config --style $HOME/.config/waybar/style.css &
ags -b hypr
swww init &
swww img $SWWW_WALLPAPER &
