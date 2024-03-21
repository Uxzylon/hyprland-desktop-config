import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const WINDOW_NAME = 'popup-background';

export default () => Widget.Window({
    name: WINDOW_NAME,
    class_names: ['popup-window'],
    visible: false,
    popup: true,
    //keymode: 'on-demand',
    exclusivity: 'ignore',
    child: Widget.Box({
        css: 'min-width: 5000px; min-height: 3000px;',
        children: [
            Widget.EventBox({
                // css: 'background-color: black;',
                hexpand: true,
                vexpand: true,
                setup: w => w.on('button-press-event', () => {
                    popups.forEach(popup => App.closeWindow(popup));
                    App.closeWindow(WINDOW_NAME);
                }),
            }),
        ],
    }),
    setup: self => self.hook(App, (_, windowName, visible) => {
        if (windowName === WINDOW_NAME) {
            if (!visible) {
                popups.forEach(popup => App.closeWindow(popup));
            }
        }
    }),
});