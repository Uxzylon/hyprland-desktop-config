import { execAsync } from "ags/process";
import { Astal, Gtk } from "ags/gtk4";
import { gdkmonitor } from "../utils/monitors";
import PopupWindow from "./PopupWindow";

export default function LogoutMenu() {
  function LogoutButton(label: string, command: string) {
    return (
      <button onClicked={() => execAsync(["sh", "-c", command])} label={label} />
    );
  }

  return (
    <PopupWindow
      name="logout-menu"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.NONE}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
    >
      {() => (
        <>
          <box cssClasses={["logout-menu"]} orientation={Gtk.Orientation.VERTICAL}>
            <box>
              {LogoutButton("lock", "hyprlock")}
              {LogoutButton("bedtime", "systemctl suspend || loginctl suspend")}
              {LogoutButton(
                "logout",
                "pkill Hyprland || loginctl terminate-user $USER",
              )}
            </box>
            <box>
              {LogoutButton(
                "power_settings_new",
                "systemctl poweroff || loginctl poweroff",
              )}
              {LogoutButton(
                "mode_standby",
                "systemctl hibernate || loginctl hibernate",
              )}
              {LogoutButton(
                "restart_alt",
                "systemctl reboot || loginctl reboot",
              )}
            </box>
          </box>
        </>
      )}
    </PopupWindow>
  );
}