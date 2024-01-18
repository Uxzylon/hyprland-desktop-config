import App from 'resource:///com/github/Aylur/ags/app.js';
import Gdk from 'gi://Gdk';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import Bar from './bar/Bar.js';
import AppLauncher from './applauncher/AppLauncher.js';
import PowerMenu from './powermenu/PowerMenu.js';
import { notificationPopup } from './notification-popups/NotificationPopups.js';
import { NotificationCenter } from './notification-center/NotificationCenter.js';

const scss = `${App.configDir}/style.scss`
const css = `${App.configDir}/style.css`
exec(`sassc ${scss} ${css}`)

export function range(length, start = 1) {
    return Array.from({ length }, (_, i) => i + start);
}

export function forMonitors(widget) {
    const n = Gdk.Display.get_default().get_n_monitors();
    return range(n, 0).map(widget);
}

// exporting the config so ags can manage the windows
export default {
    style: css,
    windows: [
        forMonitors(Bar),
        AppLauncher(),
        PowerMenu(),
        notificationPopup,
        NotificationCenter(),
    ],
};
