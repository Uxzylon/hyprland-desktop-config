#!/usr/bin/env bash

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
			
entries="📋 Clipboard\n😉 Emoji"

choice=$(echo -e "$entries" | $wofi_command -i --dmenu | awk '{print $2}')

case $choice in
    Clipboard)
        exec $HOME/.config/hypr/scripts/clipboard.sh
        ;;
    Emoji)
        exec $HOME/.config/hypr/scripts/emoji.sh
        ;;
esac

