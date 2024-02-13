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

    #cancel = false;

    get clipboard() { return this.#clipboard.value; }

    constructor() {
        super();

        Utils.subprocess('wl-paste --watch xargs', () => this.#onChange());
    }

    #onChange() {
        if (this.#cancel) {
            this.#cancel = false;
            return;
        }

        Utils.execAsync(['bash', '-c', 'cliphist list | iconv -c -t utf-8'])
            .then(out => {
                this.#clipboard.setValue(out.split('\n'))
                this.notify('clipboard');
            })
            .catch(err => console.error(err));
    }

    /** @param {string} history */
    wlCopy(history) {
        Utils.notify('clipboard', history);

        this.#cancel = true;
        Utils.execAsync(['wl-copy', history])
            .catch(err => console.error(err));
    }

    /** @param {string} text */
    async select(text) {
        Utils.execAsync(['cliphist', 'decode', `${text}`])
            .then(out => this.wlCopy(out))
            .catch(err => console.error(err));
    }
}

export default new Clipboard;