import Observable from './observable';

class Observer {
    /**
     * Objects being observed.
     *
     * @var {any}
     */
    observees = {};

    /**
     * The amount of objects observed.
     *
     * @var {number}
     */
    index = 0;

    /**
     * Observe an object.
     *
     * @param {any} obj The object to observe.
     * @param {boolean} raw Return raw information about the observee.
     *
     * @return {Observable|Proxy}
     */
    observe = (obj, raw = false) => {
        this.observees[this.index] = new Observable(obj, this.index);

        const previousIndex = this.index;

        this.index += 1;

        return raw
            ? this.observees[previousIndex]
            : this.observees[previousIndex].proxy;
    };

    /**
     * Add a listener to an object.
     *
     * @param {number} index The index your object is stored at.
     * @param {string} prop The property you want to listen to.
     * @param {Function} handler The handler called every time `prop` changes.
     *
     * @return {string} The ID of the listener added.
     */
    addListener = (index, prop, handler = (prop, from, to) => null) =>
        this.observees[index].addListener(prop, handler);
}

export default Observer;
