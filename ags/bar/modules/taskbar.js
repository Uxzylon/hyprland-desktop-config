import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';

const AppButton = (icon, text, client, monitor) => {
    return Widget.Button({
        tooltip_text: text,
        visible: Hyprland.bind('monitors').transform(monitors => {
            return monitors[monitor].activeWorkspace.id === client.workspace.id;
        }),
        child: Widget.Box({
            children: [
                Widget.Icon({
                    icon,
                }),
            ],
        }),
        on_primary_click: () => Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`),
        class_name: Hyprland.active.client.bind('address').transform(addr => `${addr === client.address ? 'focused' : ''}`),
    })
};

export default monitor => {
    return Widget.Box({
        children: Hyprland.bind('clients').transform(c => c.map(client => {
            for (const app of Applications.list) {
                if (client.title && app.match(client.title) ||
                    client.class && app.match(client.class)) {
                    return AppButton(
                        app.icon_name,
                        app.name,
                        client,
                        monitor,
                    );
                }
            }
        })),
    })
};