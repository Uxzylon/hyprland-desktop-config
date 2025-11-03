import app from "ags/gtk4/app";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { createState } from "ags";
import { gdkmonitor as defaultGdkMonitor } from "../utils/monitors";
import Graphene from "gi://Graphene";

type PopupWindowProps = {
    name: string;
    anchor?: Astal.WindowAnchor;
    marginTop?: number;
    exclusivity?: Astal.Exclusivity;
    keymode?: Astal.Keymode;
    gdkmonitor?: any;
    application?: any;
    children: (helpers: {
        hide: () => void;
        win: Astal.Window | undefined;
        contentbox: Gtk.Box | undefined;
        visible: ReturnType<typeof createState<boolean>>[0];
        setVisible: ReturnType<typeof createState<boolean>>[1];
    }) => any;
};

export default function PopupWindow(props: PopupWindowProps) {
    const [visible, setVisible] = createState<boolean>(false);

    let contentbox: Gtk.Box | undefined;
    let win: Astal.Window | undefined;

    function hide() {
        try {
            app.get_window(props.name)!.hide();
        } catch {
            // ignore if window not found
        }
        setVisible(false);
    }

    function onKey(
        _e: Gtk.EventControllerKey,
        keyval: number,
        _: number
    ) {
        if (keyval === Gdk.KEY_Escape) {
            hide();
            return;
        }
    }

    function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
        if (!contentbox || !win) return;

        const [, rect] = contentbox.compute_bounds(win);
        const position = new Graphene.Point({ x, y });

        if (!rect.contains_point(position)) {
            hide();
            return true;
        }
    }

    return (
        <window
            $={(ref) => (win = ref)}
            name={props.name}
            visible={visible}
            gdkmonitor={props.gdkmonitor ?? defaultGdkMonitor}
            anchor={props.anchor ?? Astal.WindowAnchor.NONE}
            marginTop={props.marginTop}
            exclusivity={props.exclusivity ?? Astal.Exclusivity.IGNORE}
            keymode={props.keymode ?? Astal.Keymode.EXCLUSIVE}
            application={props.application ?? app}
        >
            <Gtk.EventControllerKey onKeyPressed={onKey} />
            <Gtk.GestureClick onPressed={onClick} />
            <box
                $={(ref) => (contentbox = ref)}
                orientation={Gtk.Orientation.VERTICAL}
            >
                {props.children({ hide, win, contentbox, visible, setVisible })}
            </box>
        </window>
    );
}