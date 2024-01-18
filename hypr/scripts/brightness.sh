#!/usr/bin/env bash

iDIR="$HOME/.config/dunst/icons"
notification_timeout=1000

# if arg --gamma is passed, use gammarelay
IS_GAMMA=0
if [ "$2" == "--gamma" ]; then
	IS_GAMMA=1
fi

# Get brightness
get_backlight() {
	if [ "$IS_GAMMA" -eq 1 ]; then
		echo "$(LC_NUMERIC=C printf "%.0f\n" "$(echo "$(busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Brightness | cut -d ' ' -f2) * 100" | bc -l)")%"
		return
	fi
	echo $(brightnessctl -m | cut -d, -f4)
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
	TITLE="Brightness"
	if [ "$IS_GAMMA" -eq 1 ]; then
		TITLE="Brightness Gamma"
	fi
	notify-send -h string:x-dunst-stack-tag:brightness_notif -h int:value:$current -u low -i "$icon" "$TITLE" "$current%"
}

inc_brightness() {
	if [ "$IS_GAMMA" -eq 1 ]; then
		VALUE=$(echo "$1/100" | bc -l)
		busctl --user call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d $VALUE && get_icon && notify_user
	else
		brightnessctl set +$1% && get_icon && notify_user
	fi
}

dec_brightness() {
	if [ "$IS_GAMMA" -eq 1 ]; then
		VALUE=$(echo "$1/100" | bc -l)
		busctl --user -- call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d -$VALUE && get_icon && notify_user
	else
		brightnessctl set $1%- && get_icon && notify_user
	fi
}

# Execute accordingly
case "$1" in
	"--get")
		get_backlight
		;;
	"--inc")
		#brightnessctl set +5% && get_icon && notify_user
		#busctl --user call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d 0.05 && get_icon && notify_user
		inc_brightness 5
		;;
	"--dec")
		#brightnessctl set 5%- && get_icon && notify_user
		#busctl --user -- call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d -0.05 && get_icon && notify_user
		dec_brightness 5
		;;
	*)
		get_backlight
		;;
esac