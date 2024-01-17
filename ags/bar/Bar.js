import App from 'resource:///com/github/Aylur/ags/app.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import screenBrightnessService from '../ScreenBrightness.js';
import screenTemperatureService from '../ScreenTemperature.js';

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, make it a function
// then you can simply instantiate one by calling it

// make a button that can open applauncher
const AppLauncherButton = () => Widget.Button({
    on_clicked: () => App.toggleWindow('applauncher'),
    child: Widget.Icon({
        icon: 'view-grid-symbolic',
        size: 24,
    }),
});

const Workspaces = () => Widget.Box({
    class_name: 'workspaces',
    children: Hyprland.bind('workspaces').transform(ws => {
        return ws.sort((a, b) => a.id - b.id).map(({ id }) => Widget.Button({
            on_clicked: () => Hyprland.sendMessage(`dispatch workspace ${id}`),
            child: Widget.Label(`${id}`),
            class_name: Hyprland.active.workspace.bind('id')
                .transform(i => `${i === id ? 'focused' : ''}`),
        }));
    }),
});

const ClientTitle = () => Widget.Label({
    class_name: 'client-title',
    label: Hyprland.active.client.bind('title'),
});

const PowerButton = () => Widget.Button({
    on_clicked: () => App.toggleWindow('powermenu'),
    child: Widget.Icon({
        icon: 'system-shutdown-symbolic',
    }),
});

const Clock = () => Widget.Label({
    class_name: 'clock',
    setup: self => self
        .poll(1000, self => execAsync(['date', '+   %a %d %b %Y    %H:%M:%S'])
            .then(date => self.label = date)),
});

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
// const Notification = () => Widget.Box({
//     class_name: 'notification',
//     visible: Notifications.bind('popups').transform(p => p.length > 0),
//     children: [
//         Widget.Icon({
//             icon: 'preferences-system-notifications-symbolic',
//         }),
//         Widget.Label({
//             label: Notifications.bind('popups').transform(p => p[0]?.summary || ''),
//         }),
//     ],
// });

const Media = () => Widget.Button({
    class_name: 'media',
    on_primary_click: () => Mpris.getPlayer('')?.playPause(),
    on_scroll_up: () => Mpris.getPlayer('')?.next(),
    on_scroll_down: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Label('-').hook(Mpris, self => {
        if (Mpris.players[0]) {
            const { track_artists, track_title } = Mpris.players[0];
            self.label = `${track_artists.join(', ')} - ${track_title}`;
        } else {
            self.label = '';
        }
    }, 'player-changed'),
});

/** @param {'speaker' | 'microphone'} type */
const Volume = (type = 'speaker') => Widget.EventBox({ 
    on_scroll_up: () => {
        Audio[type].volume = Math.min(Audio[type].volume + 0.05, 1);
    },
    on_scroll_down: () => {
        Audio[type].volume = Math.max(Audio[type].volume - 0.05, 0);
    },
    on_primary_click: () => {
        Audio[type].is_muted = !Audio[type].is_muted;
    },
    on_secondary_click: () => {
        execAsync('pavucontrol')
    },
    child: Widget.Box({
        class_name: 'volume',
        children: [
            Widget.Icon().hook(Audio, self => {
                if (!Audio[type])
                    return;

                const category = {
                    101: 'overamplified',
                    67: 'high',
                    34: 'medium',
                    1: 'low',
                    0: 'muted',
                };

                const icon = Audio[type].is_muted ? 0 : [101, 67, 34, 1, 0].find(
                    threshold => threshold <= Audio[type].volume * 100);

                const prefix = type === 'speaker' ? 'audio-volume' : 'microphone-sensitivity';
                self.icon = `${prefix}-${category[icon]}-symbolic`;

            }, `${type}-changed`),
            Widget.Label().hook(Audio, self => {
                if (Audio[type]?.is_muted) {
                    self.label = '';
                } else {
                    self.label = `${Math.round((Audio[type]?.volume || 0) * 100)}%`;
                }
            }),
        ],
    })
});

const VolumeSpeaker = () => Volume('speaker');

const VolumeMic = () => Volume('microphone');

const Brightness = () => Widget.EventBox({ 
    on_scroll_up: () => {
        screenBrightnessService.screenBrightnessValue += 0.05;
    },
    on_scroll_down: () => {
        screenBrightnessService.screenBrightnessValue -= 0.05;
    },
    child: Widget.Box({
    class_name: 'brightness',
    children: [
        Widget.Icon().hook(screenBrightnessService, self => {
            const category = {
                75: 'high',
                35: 'medium',
                0: 'low',
            };

            const icon = [75, 35, 0].find(
                threshold => threshold <= screenBrightnessService.screenBrightnessValue * 100);

            self.icon = `display-brightness-${category[icon]}-symbolic`;

        }, `screen-brightness-changed`),
        Widget.Label({
            label: screenBrightnessService.bind('screen-brightness-value').transform(v => `${v}`),
            setup: self => self.hook(screenBrightnessService, (self) => {
                self.label = `${Math.round((screenBrightnessService.screenBrightnessValue) * 100)}%`;
            }, 'screen-brightness-changed'),
        }),
    ],
    })
});

const Temperature = () => Widget.EventBox({ 
    on_scroll_up: () => {
        screenTemperatureService.screenTemperatureValue += 200;
    },
    on_scroll_down: () => {
        screenTemperatureService.screenTemperatureValue -= 200;
    },
    child: Widget.Box({
    class_name: 'temperature',
    children: [
        Widget.Icon().hook(screenTemperatureService, self => {
            const category = {
                75: 'high',
                35: 'medium',
                0: 'low',
            };

            const icon = [75, 35, 0].find(
                threshold => threshold <= (screenTemperatureService.screenTemperatureValue));

            self.icon = `display-brightness-${category[icon]}-symbolic`;

        }, `screen-temperature-changed`),
        Widget.Label({
            label: screenTemperatureService.bind('screen-temperature-value').transform(v => `${v}`),
            setup: self => self.hook(screenTemperatureService, (self) => {
                self.label = `${screenTemperatureService.screenTemperatureValue}K`;
            }, 'screen-temperature-changed'),
        }),
    ],
    })
});

const BatteryLabel = () => Widget.Box({
    class_name: 'battery',
    visible: Battery.bind('available'),
    children: [
        Widget.Icon({
            icon: Battery.bind('percent').transform(p => {
                return `battery-level-${Math.floor(p / 10) * 10}-symbolic`;
            }),
        }),
        Widget.Label({
            label: Battery.bind('percent').transform(p => {
                return `${p}%`;
            }),
        }),
    ],
});

const SysTray = () => Widget.Box({
    children: SystemTray.bind('items').transform(items => {
        return items.map(
            item => Widget.Button({
            child: Widget.Icon({ binds: [['icon', item, 'icon']] }),
            on_primary_click: (_, event) => item.openMenu(event),
            on_secondary_click: (_, event) => item.activate(event),
            binds: [['tooltip-markup', item, 'tooltip-markup']],
        }));
    }),
});

// layout of the bar
const Left = () => Widget.Box({
    spacing: 8,
    children: [
        AppLauncherButton(),
        Workspaces(),
        ClientTitle(),
    ],
});

const Center = () => Widget.Box({
    spacing: 8,
    children: [
        //Media(),
        //Notification(),
    ],
});

const Right = () => Widget.Box({
    hpack: 'end',
    spacing: 8,
    children: [
        SysTray(),
        Temperature(),
        Brightness(),
        VolumeSpeaker(),
        VolumeMic(),
        BatteryLabel(),
        Clock(),
        PowerButton(),
    ],
});

export default monitor => Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    class_name: 'bar',
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Left(),
        center_widget: Center(),
        end_widget: Right(),
    }),
});
