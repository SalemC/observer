# Observer

Observe changes to JavaScript Objects.

### Basic Example

```js
const observer = new Observer();

const foo = observer.observe({ bar: 'foo' });

// Add a listener to the "bar" property on the "foo" object.
foo.addListener('bar', (prop, from, to) =>
    console.log(`Bar listener - ${prop} changed from '${from}' to '${to}'`),
);

// Add a "wildcard" listener, this will be called every time any property changes on the "foo" object.
foo.addListener('*', (prop, from, to) =>
    console.log(
        `Wildcard listener - ${prop} changed from '${from}' to '${to}'`,
    ),
);

foo.bar = 'bar';

setTimeout(() => {
    foo.bar = 'baz';
}, 1000);
```
