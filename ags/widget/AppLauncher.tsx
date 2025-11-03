import app from "ags/gtk4/app";
import { Astal, Gtk } from "ags/gtk4";
import { For, createState } from "ags";
import { gdkmonitor } from "../utils/monitors";
import AstalApps from "gi://AstalApps"
import PopupWindow from "./PopupWindow";

export default function AppLauncher() {
  const apps = new AstalApps.Apps()
  const [list, setList] = createState(getDefaultApps());

  let searchentry: Gtk.Entry;

  function getDefaultApps() {
    const appList = apps.get_list();
    appList.sort((a, b) => {
      const freqA = a.get_frequency();
      const freqB = b.get_frequency();
      return freqB - freqA;
    });
    return appList.slice(0, 20);
  }

  function search(text: string) {
    if (text === "") setList(getDefaultApps())
    else setList(apps.fuzzy_query(text).slice(0, 20))
  }

  return (
    <PopupWindow
      name="applauncher"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      marginTop={38}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
      application={app}
    >
      {({ hide }) => (
        <>
          <entry
            $={(ref) => (searchentry = ref)}
            onNotifyText={({ text }) => search(text)}
            placeholderText="Start typing to search"
          />
          <Gtk.Separator visible={list((l) => l.length > 0)} />
          <scrolledwindow
            maxContentHeight={700}
            minContentHeight={500}
            minContentWidth={400}
          >
            <box orientation={Gtk.Orientation.VERTICAL}>
              <For each={list}>
                {(appItem) => (
                  <button
                    onClicked={() => {
                      hide();
                      searchentry.set_text("");
                      setList(getDefaultApps());
                      appItem.launch();
                    }}
                  >
                    <box>
                      <image iconName={appItem.iconName} />
                      <label label={appItem.name} maxWidthChars={40} wrap />
                    </box>
                  </button>
                )}
              </For>
            </box>
          </scrolledwindow>
        </>
      )}
    </PopupWindow>
  );
}