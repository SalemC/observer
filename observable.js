class Observable {
    /**
     * Observable class.
     *
     * @param {Object} original The object to observe.
     * @param {Number} originalIndex The index the object is situated at.
     *
     * @return {Object}
     */
    constructor(original, originalIndex) {
        this.original = original;
        this.proxy = new Proxy(original, this.handler);

        return {
            original: this.original,
            proxy: this.proxy,
            originalIndex,
            index: this.index,
            listeners: this.listeners,
            addListener: this.addListener,
        }
    }

    /**
     * The amount of handlers we've added.
     *
     * @var {Number}
     */
    index = 0;

    /**
     * The listeners for our object.
     *
     * @var {Object}
     */
    listeners = {};

    /**
     * The proxy handler.
     *
     * @var {Object}
     */
    handler = {
        set: (object, prop, value) => {
            this.notify(prop, object[prop], value);
            this.notifyWildcards(prop, object[prop], value);
        },
        get: (object, prop) => {
            if (prop === 'addListener') {
                if (object.addListener) {
                    console.error("addListener exists as a property on the original object, preventing override.");
                    console.info("Use the addListener method on the Observer class instead.");
                } else {
                    return this.addListener;
                }
            }

            return object[prop];
        }
    };

    /**
      * Add a listener for our object.
      *
      * @param {String} prop The property name.
      * @param {Function} handler The handler called every time [prop] changes.
      *
      * @return {String} The ID of the listener added.
      */
    addListener = (prop, handler = (prop, from, to) => null) => {
        if (this.listeners[prop]) {
            this.listeners[prop][this.index] = handler;
        } else {
            this.listeners[prop] = {
                [this.index]: handler,
            }
        }

        const previousIndex = this.index;

        this.index += 1;

        return `${prop}-${previousIndex}`;
    }

    /**
     * Notify any listeners for the changed prop.
     *
     * @param {String} prop The property name.
     * @param {Mixed} from The value [prop] has changed from.
     * @param {Mixed} to The value [prop] has changed to.
     *
     * @return {void}
     */
    notify = (prop, from, to) => {
        const handlers = this.listeners[prop] && Object.values(this.listeners[prop]);

        if (Array.isArray(handlers) && handlers.length > 0) {
            handlers.forEach(handler => handler(prop, from, to));
        }
    }

    /**
     * Notify any wildcard listeners.
     *
     * @param {String} prop The property name.
     * @param {Mixed} from The value [prop] has changed from.
     * @param {Mixed} to The value [prop] has changed to.
     *
     * @return {void}
     */
    notifyWildcards = (prop, from, to) => {
        const handlers = this.listeners['*'] && Object.values(this.listeners['*']);

        if (Array.isArray(handlers) && handlers.length > 0) {
            handlers.forEach(handler => handler(prop, from, to));
        }
    }
}

export default Observable;
