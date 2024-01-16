import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import ShadedPopup from '../ShadedPopup.js';

const WINDOW_NAME = 'powermenu';

const performAction = (action) => {
    let command;

    switch (action) {
        case 'sleep':
            command = 'systemctl suspend';
            break;
        case 'reboot':
            command = 'systemctl reboot';
            break;
        case 'logout':
            command = 'hyprctl dispatch exit 0';
            break;
        case 'shutdown':
            command = 'systemctl poweroff';
            break;
        case 'lock':
            command = 'bash -c "sleep 0.5s && swaylock & disown"';
            break;
        default:
            console.log('Unknown action');
            return;
    }

    App.closeWindow(WINDOW_NAME);
    Utils.exec(command);
};

/**
 * @param {'sleep' | 'reboot' | 'logout' | 'shutdown' | 'lock'} action
 * @param {string} label
 */
const SysButton = (action, label, icon) => Widget.Button({
    on_clicked: () => performAction(action),
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Icon(icon),
            Widget.Label(label),
        ],
    }),
});

export default () => ShadedPopup({
    name: WINDOW_NAME,
    expand: true,
    child: Widget.Box({
        children: [
            SysButton('sleep', 'Sleep', 'system-shutdown-symbolic'),
            SysButton('reboot', 'Reboot', 'system-shutdown-symbolic'),
            SysButton('logout', 'Logout', 'system-shutdown-symbolic'),
            SysButton('shutdown', 'Shutdown', 'system-shutdown-symbolic'),
            SysButton('lock', 'Lock', 'system-lock-screen-symbolic'),
        ],
    }),
});