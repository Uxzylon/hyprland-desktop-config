import app from "ags/gtk4/app"
import style from "./style.scss"

import Bar from "./widget/Bar";
import LogoutMenu from "./widget/LogoutMenu";
import AppLauncher from "./widget/AppLauncher";

app.start({
  css: style,
  gtkTheme: "Adwaita",
  main() {
    Bar();
    LogoutMenu();
    AppLauncher();
  },
})
