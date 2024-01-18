import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class GammarelayTemperatureService extends Service {
    static {
        Service.register(
            this,
            {
                'screen-temperature-changed': ['float'],
            },
            {
                'screen-temperature-value': ['float', 'rw'],
            },
        );
    }

    #screenTemperatureValue = 0;
    #min = 1000;
    #max = 10000;

    get screen_temperature_value() {
        return this.#screenTemperatureValue;
    }

    set screen_temperature_value(value) {
        if (value < this.#min)
            value = this.#min;

        if (value > this.#max)
            value = this.#max;

        Utils.execAsync(`busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Temperature q ${value}`);
    }

    constructor() {
        super();
    
        Utils.subprocess('wl-gammarelay-rs watch {t}', (output) => {
            this.#onChange(Number(output));
        });

        this.#onChange(Number(Utils.exec('bash -c "busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Temperature | cut -d \' \' -f2"')));
    }

    #onChange(out) {
        this.#screenTemperatureValue = out;

        this.emit('changed');
        this.notify('screen-temperature-value');

        this.emit('screen-temperature-changed', this.#screenTemperatureValue);
    }

    connect(event = 'screen-temperature-changed', callback) {
        return super.connect(event, callback);
    }
}

const service = new GammarelayTemperatureService()

export default service;