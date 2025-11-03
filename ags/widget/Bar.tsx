import app from "ags/gtk4/app"
import GLib from "gi://GLib"
import Astal from "gi://Astal?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import AstalBattery from "gi://AstalBattery"
import AstalPowerProfiles from "gi://AstalPowerProfiles"
import AstalWp from "gi://AstalWp"
import AstalNetwork from "gi://AstalNetwork"
import AstalTray from "gi://AstalTray"
import AstalMpris from "gi://AstalMpris"
import AstalApps from "gi://AstalApps"
import { For, With, createBinding, createComputed, onCleanup } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import Hyprland from "gi://AstalHyprland?version=0.1";
import { workspaces } from "../utils/monitors"

function Mpris() {
  const mpris = AstalMpris.get_default()
  const apps = new AstalApps.Apps()
  const players = createBinding(mpris, "players")

  return (
    <menubutton visible={players((p) => p.length > 0)}>
      <box>
        <For each={players}>
          {(player) => {
            const [app] = apps.exact_query(player.entry)
            return <image visible={!!app.iconName} iconName={app?.iconName} />
          }}
        </For>
      </box>
      <popover>
        <box spacing={4} orientation={Gtk.Orientation.VERTICAL}>
          <For each={players}>
            {(player) => (
              <box spacing={4} widthRequest={200}>
                <box overflow={Gtk.Overflow.HIDDEN} css="border-radius: 8px;">
                  <image
                    pixelSize={64}
                    file={createBinding(player, "coverArt")}
                  />
                </box>
                <box
                  valign={Gtk.Align.CENTER}
                  orientation={Gtk.Orientation.VERTICAL}
                >
                  <label xalign={0} label={createBinding(player, "title")} />
                  <label xalign={0} label={createBinding(player, "artist")} />
                </box>
                <box hexpand halign={Gtk.Align.END}>
                  <button
                    onClicked={() => player.previous()}
                    visible={createBinding(player, "canGoPrevious")}
                  >
                    <image iconName="media-seek-backward-symbolic" />
                  </button>
                  <button
                    onClicked={() => player.play_pause()}
                    visible={createBinding(player, "canControl")}
                  >
                    <box>
                      <image
                        iconName="media-playback-start-symbolic"
                        visible={createBinding(
                          player,
                          "playbackStatus",
                        )((s) => s === AstalMpris.PlaybackStatus.PLAYING)}
                      />
                      <image
                        iconName="media-playback-pause-symbolic"
                        visible={createBinding(
                          player,
                          "playbackStatus",
                        )((s) => s !== AstalMpris.PlaybackStatus.PLAYING)}
                      />
                    </box>
                  </button>
                  <button
                    onClicked={() => player.next()}
                    visible={createBinding(player, "canGoNext")}
                  >
                    <image iconName="media-seek-forward-symbolic" />
                  </button>
                </box>
              </box>
            )}
          </For>
        </box>
      </popover>
    </menubutton>
  )
}

function Tray() {
  const tray = AstalTray.get_default()
  const items = createBinding(tray, "items")

  const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
    btn.menuModel = item.menuModel
    btn.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <box>
      <For each={items}>
        {(item) => (
          <menubutton $={(self) => init(self, item)}>
            <image gicon={createBinding(item, "gicon")} />
          </menubutton>
        )}
      </For>
    </box>
  )
}

function Network() {
  const network = AstalNetwork.get_default()
  const wifi = createBinding(network, "wifi")
  const wired = createBinding(network, "wired")

  const sorted = (arr: Array<AstalNetwork.AccessPoint>) => {
    return arr.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength)
  }

  async function connect(ap: AstalNetwork.AccessPoint) {
    try {
      await execAsync(`nmcli d wifi connect ${ap.bssid}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <menubutton visible={wifi(Boolean) && wired(Boolean)}>
      <box>
        <With value={wired}>
          {(wired) =>
            wired && <image iconName={createBinding(wired, "iconName")} />
          }
        </With>
        <With value={wifi}>
          {(wifi) =>
            wifi && <image iconName={createBinding(wifi, "iconName")} />
          }
        </With>
      </box>
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <With value={wifi}>
            {(wifi) =>
              wifi && (
                <For each={createBinding(wifi, "accessPoints")(sorted)}>
                  {(ap: AstalNetwork.AccessPoint) => (
                    <button onClicked={() => connect(ap)}>
                      <box spacing={4}>
                        <image iconName={createBinding(ap, "iconName")} />
                        <label label={createBinding(ap, "ssid")} />
                        <image
                          iconName="object-select-symbolic"
                          visible={createBinding(
                            wifi,
                            "activeAccessPoint",
                          )((active) => active === ap)}
                        />
                      </box>
                    </button>
                  )}
                </For>
              )
            }
          </With>
          <With value={wired}>
            {(wired) =>
              wired && (
                <button>
                  <box spacing={4}>
                    <image iconName={createBinding(wired, "iconName")} />
                    <label label="Wired Connection" />
                  </box>
                </button>
              )
            }
          </With>
        </box>
      </popover>
    </menubutton>
  )
}

function AudioOutput() {
  const { defaultSpeaker: speaker } = AstalWp.get_default()!

  return (
    <menubutton>
      <image iconName={createBinding(speaker, "volumeIcon")} />
      <popover>
        <box>
          <slider
            widthRequest={260}
            onChangeValue={({ value }) => speaker.set_volume(value)}
            value={createBinding(speaker, "volume")}
          />
        </box>
      </popover>
    </menubutton>
  )
}

function Battery() {
  const battery = AstalBattery.get_default()
  const powerprofiles = AstalPowerProfiles.get_default()

  const percent = createBinding(
    battery,
    "percentage",
  )((p) => `${Math.floor(p * 100)}%`)

  const setProfile = (profile: string) => {
    powerprofiles.set_active_profile(profile)
  }

  return (
    <menubutton visible={createBinding(battery, "isPresent")}>
      <box>
        <image iconName={createBinding(battery, "iconName")} />
        <label label={percent} />
      </box>
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          {powerprofiles.get_profiles().map(({ profile }) => (
            <button onClicked={() => setProfile(profile)}>
              <label label={profile} xalign={0} />
            </button>
          ))}
        </box>
      </popover>
    </menubutton>
  )
}

function Clock({ format = "%H:%M:%S" }) {
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format(format)!
  })

  return (
    <menubutton>
      <label label={time} />
      <popover>
        <Gtk.Calendar />
      </popover>
    </menubutton>
  )
}

function PowerButton() {
  return (
    <button
      cssClasses={["power-button"]}
      onClicked={() => app.toggle_window("logout-menu")}
    >
      <image iconName="system-shutdown-symbolic" />
    </button>
  )
}

function AppLauncherButton() {
  return (
    <button
      cssClasses={["app-launcher-button"]}
      onClicked={() => app.toggle_window("applauncher")}
    >
      <image iconName="view-grid-symbolic" />
    </button>
  )
}

function HyprlandWorkspaces() {
  const hyprland = Hyprland.get_default();
  const workspaceButtons = createComputed(
    [createBinding(hyprland, "workspaces"), createBinding(hyprland, "monitors")],
    (wss, monMap) => {
      const activeWorkspaces = wss
        .filter((ws) => {
          const id = Number(ws.id);
          return !(id >= -99 && id <= -2);
        })
        .sort((a, b) => Number(a.id) - Number(b.id));

      const maxId = activeWorkspaces.length
        ? Number(activeWorkspaces[activeWorkspaces.length - 1].id)
        : 1;

      const maxWorkspaces = 100;

      return [...Array(maxWorkspaces)].map((_, i) => {
        const id = i + 1;
        const ws = activeWorkspaces.find((w) => Number(w.id) === id);
        return {
          id,
          workspace: ws,
          visible: maxId >= id || id === 1,
          isActive: ws !== undefined || id === 1,
          monitorIndex: ws?.monitor ? monMap.findIndex((m) => m.name === ws.monitor.name) : undefined,
        };
      });
    },
  );

  return <box cssClasses={["Workspaces"]}>
    <box>
      <For each={workspaceButtons}>
        {(buttonData) => (
          <button
            visible={buttonData.isActive}
            cssClasses={createBinding(Hyprland.get_default(), "focusedWorkspace")((fw) => {
              const classes: string[] = [];
              const ws = buttonData.workspace;

              if (!ws) return classes;

              const isFocused =
                fw &&
                String(ws.id) === String(fw.id) &&
                ws.monitor === fw.monitor;

              if (isFocused) classes.push("focused");

              if (
                (isFocused) &&
                buttonData.monitorIndex !== undefined
              ) {
                classes.push(`monitor${buttonData.monitorIndex}`);
              }

              return classes;
            })}
            label={buttonData.isActive ? String(buttonData.id) : ""}
            onClicked={() => Hyprland.get_default().dispatch("workspace", String(buttonData.id))}
          />
        )}
      </For>
    </box>
    <button
      label="+"
      onClicked={() => {
        const buttons = workspaceButtons.get();
        const firstAvailable = buttons.find(btn => !btn.workspace && btn.id > 1);
        const targetId = firstAvailable ? firstAvailable.id : buttons[buttons.length - 1].id + 1;
        Hyprland.get_default().dispatch("workspace", String(targetId));
      }}
    />
  </box>;
}

function WindowTitle() {
  const hyprland = Hyprland.get_default();
  const title = createBinding(hyprland, "focusedClient");

  return (
    <label
      label={title.as((client) => {
        const t = client ? client.title : "";
        const maxLength = 80;
        return t.length > maxLength ? t.substring(0, maxLength) + "..." : t;
      })}
    />
  );
}

function Bar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      namespace="my-bar"
      name={`bar-${gdkmonitor.connector}`}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
      cssClasses={["Bar"]}
    >
      <centerbox>
        <box $type="start">
          <AppLauncherButton />
          <HyprlandWorkspaces />
        </box>
        <box $type="center">
          <WindowTitle />
        </box>
        <box $type="end">
          <Tray />
          <Mpris />
          <Network />
          <AudioOutput />
          <Battery />
          <PowerButton />
          <Clock />
        </box>
      </centerbox>
    </window>
  )
}

function MonitorSetup({ monitor }: { monitor: Gdk.Monitor }) {
  const bar = <Bar gdkmonitor={monitor} />
  return bar;
}

export default function () {
  const monitors = createBinding(app, "monitors");
  return (
    <For each={monitors} cleanup={(win) => (win as Gtk.Window).destroy()}>
      {(monitor) => <MonitorSetup monitor={monitor} />}
    </For>
  );
}
