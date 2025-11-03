import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createBinding } from "ags";
import Hyprland from "gi://AstalHyprland?version=0.1";

interface Monitor {
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  focused: boolean;
  scale?: number;
}

function getValidMonitor(focused: Monitor | null): Gdk.Monitor {
  if (focused) {
    const monitor = matchMonitor(focused);
    if (monitor) return monitor;
  }

  const monitors = app.get_monitors();
  return monitors[0];
}

const focusedMonitor = (createBinding as any)(Hyprland.get_default(), "focused-monitor");

const matchMonitor = (compositorMonitor: Monitor): Gdk.Monitor | null => {
    const monitors = app.get_monitors();
    if (!monitors || monitors.length === 0) return null;

    for (let gdkmonitor of monitors) {
        if (
            compositorMonitor &&
            gdkmonitor &&
            compositorMonitor.name === gdkmonitor.get_connector()
        ) {
            return gdkmonitor;
        }
    }

    return monitors.length > 0 ? monitors[0] : null;
};

export const gdkmonitor = focusedMonitor((focused: any) =>
    getValidMonitor(focused),
);

export const currentMonitorWidth = focusedMonitor((monitor: { width: any; }) => {
  return monitor ? monitor.width : 1000;
});

export const currentMonitorHeight = focusedMonitor((monitor: { height: any; }) => {
  return monitor ? monitor.height : 800;
});

// Export reactive bindings directly
export const workspaces = Hyprland.get_default().workspaces;
export const focusedWorkspace = Hyprland.get_default().focusedWorkspace;
export const clients = Hyprland.get_default().clients;
export const focusedClient = Hyprland.get_default().focusedClient;