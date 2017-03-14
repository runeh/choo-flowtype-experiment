// @flow

const choo = require('choo');
const html = require('choo/html');
const plur = require('plur');

type Model = {
    counter: number;
}

type Event = 'increment' | 'decrement' | 'incrementAsync' | 'decrementAsync';

const app: ChooApp<Event, Model> = choo();

app.use(counterStore);
app.route('/', mainView);
app.mount('body');

function mainView (state, emit) {
    const count = state.counter;

    return html`
        <body>
            <main class="app">
                <h1>Async counter</h1>
                <p>Clicked ${ count } ${ plur('time', count) }!</p>
                <button onclick=${ () => emit('increment') }>Increment</button>
                <button onclick=${ () => emit('decrement') }>Decrement</button>
                <button onclick=${ () => emit('incrementAsync') }>Increment async</button>
                <button onclick=${ () => emit('decrementAsync') }>Decrement async</button>
            </main>
        </body>
  `;
}

function counterStore(state, emitter) {
    state.counter = 0;

    emitter.on('increment', increment);
    emitter.on('decrement', decrement);
    emitter.on('decrementAsync', decrementAsync);
    emitter.on('incrementAsync', incrementAsync);

    function increment() {
        state.counter++;
        emitter.emit('render');
    }

    function decrement() {
        state.counter--;
        emitter.emit('render');
    }

    function decrementAsync() {
        setTimeout(() => emitter.emit('decrement'), 1000);
    }

    function incrementAsync() {
        setTimeout(() => emitter.emit('increment'), 1000);
    }
}
