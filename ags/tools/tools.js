import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const WINDOW_NAME = 'tools';

const Tool = (name, icon, action) => Widget.Button({
    on_clicked: () => {
        App.closeWindow(WINDOW_NAME);
        action();
    },
    child: Widget.Box({
        children: [
            Widget.Icon({
                icon,
                size: 42,
            }),
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

const Tools = (width = 500, height = 500, spacing = 12) => {
    let tools = [
        Tool('Clipboard', 'edit-paste', () => App.toggleWindow('clipboard')),
    ];

    // container holding the buttons
    const list = Widget.Box({
        vertical: true,
        children: tools,
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
    child: Tools(),
});