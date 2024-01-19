import Notification, { NotificationExceptions } from './Notification.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const List = () => Widget.Box({
    vertical: true,
    vexpand: true,
    connections: [[Notifications, self => {

        // for each notification if notification.summary is Volume|Brightness|Brightness Gamma|Temperature
        if (Notifications.notifications.length > 0) {
            for (let i = 0; i < Notifications.notifications.length; i++) {
                var notif = Notifications.notifications[i];
                if (notif.summary.match(NotificationExceptions) && !notif.popup) {
                    notif.close();
                }
            }
        }

        self.children = Notifications.notifications
            .reverse()
            .map(Notification);

        self.visible = Notifications.notifications.length > 0;
    }]],
});

const Placeholder = () => Widget.Box({
    className: 'placeholder',
    vertical: true,
    vexpand: true,
    vpack: 'center',
    children: [
        Widget.Icon('notifications-disabled-symbolic'),
        Widget.Label('Your inbox is empty'),
    ],
    binds: [
        ['visible', Notifications, 'notifications', n => n.length === 0],
    ],
});

export const NotificationList = () => Widget.Scrollable({
    hscroll: 'never',
    vscroll: 'automatic',
    child: Widget.Box({
        className: 'list',
        vertical: true,
        children: [
            List(),
            Placeholder(),
        ],
    }),
});

export const ClearButton = () => Widget.Button({
    onClicked: () => Notifications.clear(),
    binds: [
        ['sensitive', Notifications, 'notifications', n => n.length > 0],
    ],
    child: Widget.Box({
        children: [
            Widget.Label('Clear'),
            Widget.Icon({
                binds: [
                    ['icon', Notifications, 'notifications', n =>
                        `user-trash-${n.length > 0 ? 'full-' : ''}symbolic`],
                ],
            }),
        ],
    }),
});

export const DNDSwitch = () => Widget.Button({
    on_clicked: () => Notifications.dnd = !Notifications.dnd,
    binds: [
        ['active', Notifications, 'dnd'],
    ],
    child: Widget.Icon({
        binds: [
            ['icon', Notifications, 'dnd', dnd => {
                if (dnd) {
                    return 'notification-disabled-symbolic';
                }
                return 'notification-symbolic';
            }],
        ],
    }),
});