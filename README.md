# Hyprland Desktop Config

This repository contains the configuration files for my desktop environment.

## Installation

### Arch Linux

#### Requirements

```bash
yay -S adobe-source-code-pro-fonts aylurs-gtk-shell bc btop cava cliphist ffmpegthumbs foot gnome-keyring gnome-system-monitor grim gtk-engine-murrine gvfs gvfs-mtp hyprland hyprpicker-git jq layer-shell-qt5 mousepad mpv network-manager-applet noto-fonts-emoji nvtop nwg-look-bin otf-font-awesome otf-font-awesome-4 pacman-contrib pamixer pavucontrol pipewire-alsa playerctl polkit-kde-agent python-pam python-requests qt5-graphicaleffects qt5-svg qt5-quickcontrols2 qt5ct sassc sysstat slurp swappy swaybg swayidle sway-audio-idle-inhibit-git swww ttf-droid ttf-fira-code ttf-jetbrains-mono ttf-jetbrains-mono-nerd viewnior vim wget wl-clipboard wl-gammarelay-rs wlsunset wofi xdg-user-dirs
```

#### GTK Theme

```bash
git clone https://github.com/Fausto-Korpsvart/Tokyo-Night-GTK-Theme.git
mkdir -p ~/.themes
cp -r Tokyo-Night-GTK-Theme/themes/Tokyonight-Dark-B ~/.themes/
rm -rf Tokyo-Night-GTK-Theme
wget https://github.com/ljmill/tokyo-night-icons/releases/download/v0.2.0/TokyoNight-SE.tar.bz2
mkdir -p ~/.icons
tar -xvf TokyoNight-SE.tar.bz2 -C ~/.icons/
rm -rf TokyoNight-SE.tar.bz2
sed -i 's/gtk-theme-name=.*/gtk-theme-name=Tokyonight-Dark-B/g' ~/.config/gtk-3.0/settings.ini
sed -i 's/gtk-icon-theme-name=.*/gtk-icon-theme-name=TokyoNight-SE/g' ~/.config/gtk-3.0/settings.ini
gsettings set org.gnome.desktop.interface gtk-theme 'Tokyonight-Dark-B'
gsettings set org.gnome.desktop.interface icon-theme 'TokyoNight-SE'
```

#### SDDM Theme

```bash
git clone https://github.com/catppuccin/sddm.git
sudo mv sddm/src/catppuccin-mocha /usr/share/sddm/themes/
sudo chown -R root:root /usr/share/sddm/themes/catppuccin-mocha
rm -rf sddm
echo -e "[Theme]\nCurrent=catppuccin-mocha" | sudo tee /etc/sddm.conf.d/theme.conf > /dev/null
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
