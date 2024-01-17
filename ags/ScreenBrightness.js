import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class ScreenBrightnessService extends Service {
    // every subclass of GObject.Object has to register itself
    static {
        // takes three arguments
        // the class itself
        // an object defining the signals
        // an object defining its properties
        Service.register(
            this,
            {
                // 'name-of-signal': [type as a string from GObject.TYPE_<type>],
                'screen-brightness-changed': ['float'],
            },
            {
                // 'kebab-cased-name': [type as a string from GObject.TYPE_<type>, 'r' | 'w' | 'rw']
                // 'r' means readable
                // 'w' means writable
                // guess what 'rw' means
                'screen-brightness-value': ['float', 'rw'],
            },
        );
    }

    // # prefix means private in JS
    #screenBrightnessValue = 0;
    #max = 100;

    // the getter has to be in snake_case
    get screen_brightness_value() {
        return this.#screenBrightnessValue;
    }

    // the setter has to be in snake_case too
    set screen_brightness_value(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        Utils.execAsync(`busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Brightness d ${percent}`);
        // the file monitor will handle the rest
    }

    constructor() {
        super();
    
        // setup monitor
        Utils.subprocess('wl-gammarelay-rs watch {bp}', (output) => {
            this.#onChange(Number(output) / this.#max);
        });

        // initialize
        this.#onChange(Number(Utils.exec('bash -c "busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Brightness | cut -d \' \' -f2"')));
    }

    #onChange(out) {
        this.#screenBrightnessValue = out;

        // signals have to be explicity emitted
        this.emit('changed'); // emits "changed"
        this.notify('screen-brightness-value'); // emits "notify::screen-brightness-value"

        // or use Service.changed(propName: string) which does the above two
        // this.changed('screen-brightness-value');

        // emit screen-brightness-changed with the percent as a parameter
        this.emit('screen-brightness-changed', this.#screenBrightnessValue);
    }

    // overwriting the connect method, let's you
    // change the default event that widgets connect to
    connect(event = 'screen-brightness-changed', callback) {
        return super.connect(event, callback);
    }
}

// the singleton instance
const screenBrightnessService = new ScreenBrightnessService()

// export to use in other modules
export default screenBrightnessService;