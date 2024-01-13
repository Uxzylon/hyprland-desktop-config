import icons from '../../icons.js';
import options from '../../options.js';
import { App, Hyprland, Applications, Utils, Widget } from '../../imports.js';
import { launchApp } from '../../utils.js';

const focus = ({ address }) => Utils.execAsync(`hyprctl dispatch focuswindow address:${address}`);

const AppButton = ({ icon, ...rest }) => Widget.Button({
    ...rest,
    child: Widget.Box({
        class_name: 'box',
        child: Widget.Overlay({
            child: Widget.Icon({ icon, size: 28 }),
            overlays: [Widget.Box({
                class_name: 'indicator',
                vpack: 'end',
                hpack: 'center',
            })],
        }),
    }),
});

const Taskbar = () => Widget.Box({
    binds: [['children', Hyprland, 'clients', c => c.map(client => {
        // for (const appName of options.dock.pinnedApps) {
        //     if (client.class.toLowerCase().includes(appName.toLowerCase()))
        //         return null;
        // }
        let score = 0;
        let app_index = -1;
        for (const app of Applications.list) {
            
            // display app only if on same workspace
            // doesn't update on workspace change (! TODO !)
            // if (client.workspace.id !== Hyprland.active.workspace.id)
            //     return null;
            
            if (client.title && app.match(client.title) || client.class && app.match(client.class)) {
                let new_score = 0;
                let title = client.title.toLowerCase();
                let name = app.name.toLowerCase();
                let class_name = client.class.toLowerCase();
                
                if (title.includes(name) || class_name.includes(name)) {
                    new_score += 100;
                } else {
                    let title_words = title.split(' ');
                    let name_words = name.split(' ');
                    let common_words = title_words.filter(word => name_words.includes(word));
                    new_score += common_words.length * 10;
                }

                if (new_score > score) {
                    score = new_score;
                    app_index = Applications.list.indexOf(app);
                }
            }
        }

        if (app_index == -1) {
            app_index = 0;
        }

        const app = Applications.list[app_index];
        if (!app)
            return null;
        return AppButton({
            icon: app.icon_name,
            tooltipText: app.name,
            onPrimaryClick: () => focus(client),
            onMiddleClick: () => launchApp(app),
            connections: [[Hyprland, button => {
                button.toggleClassName('focused', Hyprland.active.client.address == client.address);
            }]],
        });

    })]],
});

const PinnedApps = () => Widget.Box({
    class_name: 'pins',
    homogeneous: true,
    children: options.dock.pinnedApps
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term = true }) => AppButton({
            icon: app.icon_name,
            onPrimaryClick: () => {
                for (const client of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                        return focus(client);
                }

                launchApp(app);
            },
            onMiddleClick: () => launchApp(app),
            tooltipText: app.name,
            connections: [[Hyprland, button => {
                const running = Hyprland.clients
                    .find(client => client.class.toLowerCase().includes(term)) || false;

                button.toggleClassName('nonrunning', !running);
                button.toggleClassName('focused', Hyprland.active.client.address == running.address);
                button.set_tooltip_text(running ? running.title : app.name);
            }]],
        })),
});

const Dock = () => {
    const pinnedapps = PinnedApps();
    const taskbar = Taskbar();
    const separator = Widget.Separator({
        vpack: 'center',
        hpack: 'center',
        orientation: 1,
        connections: [[Hyprland, box => box.visible = taskbar.children.length > 0]],
    });
    return Widget.Box({
        class_name: 'dock',
        children: [taskbar],
    });
}

export default () => {
    return Widget.Box({
        class_name: 'taskbar',
        children: [Dock()],
    });
};
