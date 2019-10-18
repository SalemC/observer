import Observable from './observable';

class Observer {
    /**
     * Objects we're observing.
     *
     * @var {Object}
     */
    observees = {};

    /**
     * The amount of objects we've observed.
     *
     * @var {Number}
     */
    index = 0;

    /**
     * Observe an object.
     *
     * @param {Object} object The object to observe.
     * @param {Boolean} raw Return raw information about the observee.
     *
     * @return {Observable|Proxy}
     */
    observe = (object, raw = false) => {
        this.observees[this.index] = new Observable(object, this.index);

        const previousIndex = this.index;

        this.index += 1;

        return raw
            ? this.observees[previousIndex]
            : this.observees[previousIndex].proxy;
    }

    /**
     * Add a listener to an object.
     *
     * @param {Number} index The index your object is stored at.
     * @param {String} prop The property you want to listen to.
     * @param {Function} handler The handler called every time [prop] changes.
     *
     * @return {String} The ID of the listener added.
     */
    addListener = (index, prop, handler = (prop, from, to) => null) => {
        return this.observees[index].addListener(prop, handler);
    }
}

export default Observer;
