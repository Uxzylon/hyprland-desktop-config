import Service from 'resource:///com/github/Aylur/ags/service.js';
import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class Clipboard extends Service {
    static {
        Service.register(this, {}, {
            'clipboard': ['string[]'],
        });
    }

    /** @type {Variable<string[]>} */
    #clipboard = new Variable([]);
    get clipboard() { return this.#clipboard.value; }

    constructor() {
        super();

        this.#clipboard.connect('changed', () => this.changed('clipboard'));

        Utils.execAsync(['bash', '-c', 'cliphist list | iconv -c -t utf-8'])
            .then(out => this.#clipboard.setValue(out.split('\n')))
            .catch(err => console.error(err));
    }

    /** @param {string} history */
    wlCopy(history) {
        Utils.execAsync(['wl-copy', history])
            .catch(err => console.error(err));
    }

    /** @param {number} index */
    async select(index) {
        const history = this.#clipboard.value[index];
        if (!history)
            return;

        // Use cliphist decode
        Utils.execAsync(['cliphist', 'decode', `${history}`])
            .then(out => this.wlCopy(out))
            .catch(err => console.error(err));

        //this.wlCopy(history);
    }
}

export default new Clipboard;