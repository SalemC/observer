class Observable {
    /**
     * Construct this class.
     *
     * @param {any} original The object to observe.
     * @param {number} originalIndex The index the object is situated at.
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
        };
    }

    /**
     * The amount of handlers added.
     *
     * @var {number}
     */
    index = 0;

    /**
     * The listeners for the object.
     *
     * @var {any}
     */
    listeners = {};

    /**
     * The proxy handler.
     *
     * @var {any}
     */
    handler = {
        set: (obj, prop, value) => {
            this.notify(prop, obj[prop], value);
            this.notifyWildcards(prop, obj[prop], value);
        },
        get: (obj, prop) => {
            if (prop === 'addListener') {
                if (obj.addListener) {
                    console.error(
                        'addListener exists as a property on the original object, preventing override.',
                    );

                    console.info(
                        'Use the addListener method on the Observer class instead.',
                    );
                } else {
                    return this.addListener;
                }
            }

            return obj[prop];
        },
    };

    /**
     * Add a listener for the object.
     *
     * @param {string} prop The property name.
     * @param {Function} handler The handler called every time `prop` changes.
     *
     * @return {string} The ID of the listener added.
     */
    addListener = (prop, handler = (prop, from, to) => null) => {
        if (this.listeners[prop]) {
            this.listeners[prop][this.index] = handler;
        } else {
            this.listeners[prop] = {
                [this.index]: handler,
            };
        }

        const previousIndex = this.index;

        this.index += 1;

        return `${prop}-${previousIndex}`;
    };

    /**
     * Notify any listeners for the changed prop.
     *
     * @param {string} prop The property name.
     * @param {any} from The value `prop` has changed from.
     * @param {any} to The value `prop` has changed to.
     *
     * @return {void}
     */
    notify = (prop, from, to) => {
        (prop in this.listeners
            ? Object.values(this.listeners[prop])
            : []
        ).forEach((handler) => handler(prop, from, to));
    };

    /**
     * Notify any wildcard listeners.
     *
     * @param {string} prop The property name.
     * @param {any} from The value `prop` has changed from.
     * @param {any} to The value `prop` has changed to.
     *
     * @return {void}
     */
    notifyWildcards = (prop, from, to) => {
        const key = '*';

        (key in this.listeners
            ? Object.values(this.listeners[key])
            : []
        ).forEach((handler) => handler(prop, from, to));
    };
}

export default Observable;
