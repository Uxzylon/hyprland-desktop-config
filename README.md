# Hyprland Desktop Config

This repository contains the configuration files for my desktop environment.

## Installation

### Arch Linux

#### Requirements

```bash
yay -Sy aylurs-gtk-shell-git hyprpolkitagent pipewire qt5-wayland qt6-wayland waybar wireplumber xdg-desktop-portal-hyprland xdg-desktop-portal-gtk qt6ct
```

Open qt6ct, set colors to "darker"

```bash
yay -S adobe-source-code-pro-fonts bc btop cava cliphist dunst ffmpegthumbs foot gnome-keyring gnome-system-monitor grim gvfs gvfs-mtp hyprland hyprpicker-git jq mousepad mpv network-manager-applet noto-fonts-emoji nvtop nwg-look-bin otf-font-awesome otf-font-awesome-4 pacman-contrib pamixer pavucontrol pipewire-alsa playerctl polkit-kde-agent python-requests qt5ct slurp swappy swaybg swayidle swaylock-effects-git sway-audio-idle-inhibit-git swww ttf-droid ttf-fira-code ttf-jetbrains-mono ttf-jetbrains-mono-nerd viewnior vim waybar wget wl-clipboard wl-gammarelay-rs wlsunset wofi xdg-user-dirs
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

#### Fix Terminal apps Not working correctly with foot
    
```bash
sudo ln -s /usr/bin/foot /usr/bin/gnome-terminal
```
