import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
// import { lockscreens } from 'resource:///com/github/Aylur/ags/lockscreens.js';
const authpy = App.configDir + '/lockscreen/auth.py';

/** @param {number} monitor */
export default monitor => {

    const defaultLoginText = "Please enter your password";

    const loginText = Widget.Label({
        label: defaultLoginText,
    });

    const PasswordEntry = () => {
        const spinner = Widget.Spinner({
            active: false,
            vpack: 'center',
        });

        const passwordEntry = Widget.Entry({
            visibility: false,
            placeholder_text: 'Password',
            text: '',
            on_accept: ({ text }) => {
                verifyPassword(text);
            },
            hpack: 'center',
            hexpand: true,
        });
    
        const verifyPassword = password => {
            spinner.active = true;
            execAsync([authpy, password])
                .then(out => {
                    lockscreens.forEach(win => win.visible = out !== 'True');
                    loginText.label = out !== 'True' ? "Incorrect password" : defaultLoginText;
                    passwordEntry.text = '';
                    spinner.active = false;
                });
        };
    
        const submit = Widget.Button({
            label: 'Submit',
            on_clicked: () => {
                verifyPassword(passwordEntry.text);
            },
            hpack: 'center',
        });
    
        return Widget.Box({
            children: [
                passwordEntry,
                submit,
                spinner,
            ],
        });
    };

    const lockscreen = Widget.Window({
        name: `lockscreen${monitor}`,
        class_name: 'lockscreen',
        monitor,
        visible: false,
        layer: 'overlay',
        keymode: 'exclusive',
        exclusivity: 'exclusive',
        child: Widget.Box({
            css: 'min-width: 3000px; min-height: 2000px;',
            child: Widget.Box({
                class_name: 'content',
                vertical: true,
                hexpand: true,
                vexpand: true,
                hpack: 'center',
                vpack: 'center',
                children: [
                    PasswordEntry(),
                    loginText,
                ],
            }),
        }),
    });

    return lockscreen;
}
