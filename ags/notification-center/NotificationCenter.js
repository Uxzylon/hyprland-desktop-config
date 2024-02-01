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

export default () => Widget.Window({
    name: 'notification-center',
    anchor: ['right', 'top', 'bottom'],
    popup: true,
    keymode: 'on-demand',
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