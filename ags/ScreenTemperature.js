import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class ScreenTemperatureService extends Service {
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
                'screen-temperature-changed': ['float'],
            },
            {
                // 'kebab-cased-name': [type as a string from GObject.TYPE_<type>, 'r' | 'w' | 'rw']
                // 'r' means readable
                // 'w' means writable
                // guess what 'rw' means
                'screen-temperature-value': ['float', 'rw'],
            },
        );
    }

    // # prefix means private in JS
    #screenTemperatureValue = 0;
    #min = 1000;
    #max = 10000;

    // the getter has to be in snake_case
    get screen_temperature_value() {
        return this.#screenTemperatureValue;
    }

    // the setter has to be in snake_case too
    set screen_temperature_value(value) {
        if (value < this.#min)
            value = this.#min;

        if (value > this.#max)
            value = this.#max;

        Utils.execAsync(`busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Temperature q ${value}`);
        // the file monitor will handle the rest
    }

    constructor() {
        super();
    
        // setup monitor
        Utils.subprocess('wl-gammarelay-rs watch {t}', (output) => {
            this.#onChange(Number(output));
        });

        // initialize
        this.#onChange(Number(Utils.exec('bash -c "busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Temperature | cut -d \' \' -f2"')));
    }

    #onChange(out) {
        this.#screenTemperatureValue = out;

        // signals have to be explicity emitted
        this.emit('changed'); // emits "changed"
        this.notify('screen-temperature-value'); // emits "notify::screen-temperature-value"

        // or use Service.changed(propName: string) which does the above two
        // this.changed('screen-temperature-value');

        // emit screen-temperature-changed with the percent as a parameter
        this.emit('screen-temperature-changed', this.#screenTemperatureValue);
    }

    // overwriting the connect method, let's you
    // change the default event that widgets connect to
    connect(event = 'screen-temperature-changed', callback) {
        return super.connect(event, callback);
    }
}

// the singleton instance
const screenTemperatureService = new ScreenTemperatureService()

// export to use in other modules
export default screenTemperatureService;