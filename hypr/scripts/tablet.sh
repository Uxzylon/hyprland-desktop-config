#!/usr/bin/env bash

# Device to disable in tablet mode
DEVICE="device:syna32b3:01-06cb:ce7d-touchpad"

if [ -z "$XDG_RUNTIME_DIR" ]; then
    export XDG_RUNTIME_DIR=/run/user/$(id -u)
fi

export STATUS_FILE="$XDG_RUNTIME_DIR/tablet_mode.status"

enable_tablet_mode() {
    printf "true" > "$STATUS_FILE"
    hyprctl keyword "$DEVICE:enabled" false
}

disable_tablet_mode() {
    printf "false" > "$STATUS_FILE"
    hyprctl keyword "$DEVICE:enabled" true
}

# Toggle tablet mode
if ! [ -f "$STATUS_FILE" ]; then
    enable_tablet_mode
else
    if [ "$(cat "$STATUS_FILE")" = "true" ]; then
        disable_tablet_mode
    else
        enable_tablet_mode
    fi
fi

setsysmode toggle
