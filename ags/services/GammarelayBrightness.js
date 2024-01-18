import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class GammarelayBrightnessService extends Service {
    static {
        Service.register(
            this,
            {
                'screen-brightness-changed': ['float'],
            },
            {
                'screen-brightness-value': ['float', 'rw'],
            },
        );
    }

    #screenBrightnessValue = 0;
    #max = 100;

    get screen_brightness_value() {
        return this.#screenBrightnessValue;
    }

    set screen_brightness_value(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        Utils.execAsync(`busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Brightness d ${percent}`);
    }

    constructor() {
        super();
    
        Utils.subprocess('wl-gammarelay-rs watch {bp}', (output) => {
            this.#onChange(Number(output) / this.#max);
        });

        this.#onChange(Number(Utils.exec('bash -c "busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Brightness | cut -d \' \' -f2"')));
    }

    #onChange(out) {
        this.#screenBrightnessValue = out;

        this.emit('changed');
        this.notify('screen-brightness-value');

        this.emit('screen-brightness-changed', this.#screenBrightnessValue);
    }

    connect(event = 'screen-brightness-changed', callback) {
        return super.connect(event, callback);
    }
}

const service = new GammarelayBrightnessService()

export default service;