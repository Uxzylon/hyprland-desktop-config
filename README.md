# Hyprland Desktop Config

This repository contains the configuration files for my desktop environment.

## Installation

### Arch Linux

#### Requirements

```bash
yay -S adobe-source-code-pro-fonts brightnessctl btop cava cliphist dunst ffmpegthumbs foot gnome-system-monitor grim gvfs gvfs-mtp jq mousepad mpv network-manager-applet noto-fonts-emoji nvtop nwg-look-bin otf-font-awesome otf-font-awesome-4 pacman-contrib pamixer pavucontrol pipewire-alsa playerctl polkit-kde-agent python-requests qt5ct slurp swappy swaybg swayidle swaylock-effects swww ttf-droid ttf-fira-code ttf-jetbrains-mono ttf-jetbrains-mono-nerd viewnior vim waybar wget wl-clipboard wlsunset wofi xdg-user-dirs
```

#### Bluetooth

```bash
yay -S bluez bluez-utils blueman
sudo systemctl enable bluetooth.service
```

#### Thunar (File Manager)

```bash
yay -S thunar thunar-volman tumbler thunar-archive-plugin
```