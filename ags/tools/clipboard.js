import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Clipboard from '../services/Clipboard.js';

const WINDOW_NAME = 'clipboard';

const Entry = (name) => Widget.Button({
    on_clicked: () => {
        App.closeWindow(WINDOW_NAME);
        Clipboard.select(name);
    },
    child: Widget.Box({
        children: [
            Widget.Label({
                class_name: 'title',
                label: name,
                xalign: 0,
                vpack: 'center',
                truncate: 'end',
            }),
        ],
    }),
});

const History = (width = 500, height = 500, spacing = 12) => {
    let entries = Clipboard.bind('clipboard').transform(history => history.map(entry => Entry(entry)));

    // container holding the buttons
    const list = Widget.Box({
        vertical: true,
        children: entries,
        spacing,
    });

    return Widget.Box({
        vertical: true,
        css: `margin: ${spacing * 2}px;`,
        children: [
            // wrap the list in a scrollable
            Widget.Scrollable({
                hscroll: 'never',
                css: `
                    min-width: ${width}px;
                    min-height: ${height}px;
                `,
                child: list,
            }),
        ],
        setup: self => self.hook(App, (_, windowName, visible) => {
            if (windowName !== WINDOW_NAME)
                return;
        }),
    });
};

export default () => Widget.Window({
    name: WINDOW_NAME,
    class_names: ['popup-window', 'menu'],
    visible: false,
    popup: true,
    layer: 'overlay',
    keymode: 'exclusive',
    exclusivity: 'ignore',
    expand: true,
    child: History(),
});