import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

const Workspace = (id, monitor) => {
    return Widget.Button({
        visible: Hyprland.bind('monitors').transform(monitors => {
            return (Math.abs(monitors[monitor].activeWorkspace.id - id) <= 4);
        }),
        on_clicked: () => Hyprland.sendMessage(`dispatch workspace ${id}`),
        child: Widget.Label(`${id % 1000}`),
        class_name: Hyprland.bind('monitors').transform(monitors => {
            return (monitors[monitor].activeWorkspace.id === id ? 'focused' : '');
        }),
    })
};

export default monitor => {
    return Widget.Box({
        class_name: 'workspaces',
        children: Hyprland.bind('workspaces').transform(ws => {
            return ws.sort((a, b) => a.id - b.id).map(workspace => {
                return Workspace(
                    workspace.id,
                    monitor,
                );
            })
        }),
    });
};