#!/bin/bash

# WOFI STYLES
CONFIG="$HOME/.config/wofi/WofiBig/config"
STYLE="$HOME/.config/wofi/style.css"
COLORS="$HOME/.config/wofi/colors"

# Wofi window config (in %)
WOFI_WIDTH=5
WOFI_HEIGHT=23

wofi_command="wofi --show dmenu \
			--prompt choose... \
			--conf $CONFIG --style $STYLE --color $COLORS \
			--width=$WOFI_WIDTH% --height=$WOFI_HEIGHT% \
			--cache-file=/dev/null \
			--hide-scroll --no-actions \
			--matching=fuzzy"
			
entries=$(echo -e "cmyk\nhex\nrgb\nhsl\nhsv" | $wofi_command -i --dmenu | awk '{print tolower($1)}')

sleep 0.5

case $entries in 
    cmyk)
        hyprpicker -f cmyk -a
        ;;
    hex)
        hyprpicker -f hex -a
        ;;
    rgb)
        hyprpicker -f rgb -a
        ;;
    hsl)
        hyprpicker -f hsl -a
        ;;
    hsv)
        hyprpicker -f hsv -a
        ;;
esac
