import { App, Widget } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/bar/Bar"
import NotificationPopups from "./notifications/NotificationPopups"
import Applauncher from "./widget/applauncher/Applauncher"
import OSD from "./widget/osd/OSD"
import MprisPlayers from "./widget/mediaplayer/MediaPlayer"

App.start({
    css: style,
    main() {
        App.get_monitors().map(Bar)
        App.get_monitors().map(NotificationPopups)
        Applauncher()
        App.get_monitors().map(OSD)
        new Widget.Window({}, MprisPlayers())
    },
})
