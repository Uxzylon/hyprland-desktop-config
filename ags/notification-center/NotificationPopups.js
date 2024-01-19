import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notification, { NotificationExceptions } from './Notification.js';

export default () => Widget.Window({
    name: 'notifications',
    anchor: ['top', 'right'],
    child: Widget.Box({
        class_name: 'notifications',
        vertical: true,
        children: Notifications.bind('popups').transform(popups => {
            
            // take the current notification and the previous one. If they are both Volume|Brightness|Brightness Gamma|Temperature, close the previous one
            var current = popups[popups.length - 1];
            var previous = popups[popups.length - 2];
            if (current && previous) {
                if (current.summary.match(NotificationExceptions) && previous.summary.match(NotificationExceptions)) {
                    previous.close();
                }
            }

            return popups.map(Notification);
        }),
    }),
});