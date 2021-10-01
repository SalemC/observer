import Observer from './observer';

const observer = new Observer();

const foo = observer.observe({ bar: 'foo' });

foo.addListener('bar', (prop, from, to) => {
    console.log(`Bar listener - ${prop} changed from '${from}' to '${to}'`);
});

foo.addListener('*', (prop, from, to) => {
    console.log(
        `Wildcard listener - ${prop} changed from '${from}' to '${to}'`,
    );
});

foo.bar = 'bar';

setTimeout(() => {
    foo.bar = 'baz';
}, 1000);
