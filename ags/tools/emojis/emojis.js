import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { readFileAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import Clipboard from '../../services/Clipboard.js';

const WINDOW_NAME = 'emojis';

const Emoji = (emoji, name) => Widget.Button({
    on_clicked: () => {
        App.closeWindow(WINDOW_NAME);
        Clipboard.wlCopy(emoji, true);
    },
    child: Widget.Box({
        children: [
            Widget.Label({
                class_name: 'title',
                label: emoji + ' ' + name,
                xalign: 0,
                vpack: 'center',
                truncate: 'end',
            }),
        ],
    }),
});

const Emojis = (width = 500, height = 500, spacing = 12) => {
    const emojis = Variable([]);
    readFileAsync(App.configDir + '/tools/emojis/emojis.txt')
        .then(data => data.split('\n')
            .map(line => {
                const [emoji, ...name] = line.split(' ');
                emojis.value.push(Emoji(emoji, name.join(' ')));
            })
        )
        .catch(err => console.error(err));

    // container holding the buttons
    const list = Widget.Box({
        vertical: true,
        children: emojis.bind(),
        spacing,
    });

    // search entry
    const search = Widget.Entry({
        hexpand: true,
        css: `margin-bottom: ${spacing}px;`,

        // to launch the first item on Enter
        on_accept: () => {
            if (emojis.value[0]) {
                App.toggleWindow(WINDOW_NAME);
                
                const emojisFound = emojis.filter(emoji => emoji.visible);
                if (emojisFound.length > 0) {
                    //emojisFound[0].attribute.app.launch();
                }
            }
        },

        // filter out the list
        on_change: ({ text }) => emojis.value.forEach(item => {
            item.visible = item.child.children[0].label.toLowerCase().includes(text.toLowerCase())
        }),
    });

    return Widget.Box({
        vertical: true,
        css: `margin: ${spacing * 2}px;`,
        children: [
            search,

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

            // when the menu shows up
            if (visible) {
                search.text = '';
                search.grab_focus();
            }
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
    child: Emojis(),
});