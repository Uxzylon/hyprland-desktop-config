#!/usr/bin/env bash

iDIR="$HOME/.config/dunst/icons"
notification_timeout=1000

# Get brightness
get_backlight() {
	echo $(LC_NUMERIC=C printf "%.0f\n" "$(echo "$(busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Brightness | cut -d ' ' -f2) * 100" | bc -l)")
}

# Get icons
get_icon() {
	current=$(get_backlight | sed 's/%//')
	if   [ "$current" -le "20" ]; then
		icon="$iDIR/brightness-20.png"
	elif [ "$current" -le "40" ]; then
		icon="$iDIR/brightness-40.png"
	elif [ "$current" -le "60" ]; then
		icon="$iDIR/brightness-60.png"
	elif [ "$current" -le "80" ]; then
		icon="$iDIR/brightness-80.png"
	else
		icon="$iDIR/brightness-100.png"
	fi
}

# Notify
notify_user() {
	notify-send -h string:x-dunst-stack-tag:brightness_notif -h int:value:$current -u low -i "$icon" "Brightness : $current%"
}

# Execute accordingly
case "$1" in
	"--get")
		get_backlight
		;;
	"--inc")
		busctl --user call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d 0.05 && get_icon && notify_user
		;;
	"--dec")
		busctl --user -- call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d -0.05 && get_icon && notify_user
		;;
	*)
		get_backlight
		;;
esac