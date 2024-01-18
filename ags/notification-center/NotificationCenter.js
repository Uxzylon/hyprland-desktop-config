import { NotificationList, DNDSwitch, ClearButton } from './Widgets.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

const Header = () => Widget.Box({
    className: 'header',
    children: [
        Widget.Label('Do Not Disturb'),
        DNDSwitch(),
        Widget.Box({ hexpand: true }),
        ClearButton(),
    ],
});

export const NotificationCenter = () => Widget.Window({
    name: 'notification-center',
    anchor: ['right', 'top', 'bottom'],
    popup: true,
    focusable: true,
    visible: false,
    child: Widget.Box({
        children: [
            Widget.EventBox({
                hexpand: true,
                connections: [['button-press-event', () =>
                    App.closeWindow('notification-center')]]
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Header(),
                    NotificationList(),
                ],
            }),
        ],
    }),
});

// timeout(500, () => execAsync([
//     'notify-send',
//     'Notification Center example',
//     'To have the panel popup run "ags toggle-window notification-center"' +
//     '\nPress ESC to close it.',
// ]).catch(console.error));

// export default {
//     style: App.configDir + '/style.css',
//     windows: [
//         NotificationsPopupWindow(),
//         NotificationCenter(),
//     ]
// }

// export default () => ShadedPopup({
//     name: WINDOW_NAME,
//     expand: true,
//     child: Widget.Box({
//         children: [
//             SysButton('sleep', 'Sleep', 'system-shutdown-symbolic'),
//             SysButton('reboot', 'Reboot', 'system-shutdown-symbolic'),
//             SysButton('logout', 'Logout', 'system-shutdown-symbolic'),
//             SysButton('shutdown', 'Shutdown', 'system-shutdown-symbolic'),
//             SysButton('lock', 'Lock', 'system-lock-screen-symbolic'),
//         ],
//     }),
// });