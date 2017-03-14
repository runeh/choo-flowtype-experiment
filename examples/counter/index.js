// @flow
const choo = require('choo');
const html = require('choo/html');

// Type of the app state
type Model = {
    counter: number;
}

// All app specific events. Emitter also understands the built in choo events
// "domcontentloaded", "render" and "*"
type Event = 'increment' | 'decrement';

// Optional type alias used in events
type Delta = number;

// App must be given types for the valid events and the state model
// Optionaly use ChooApp<any, any> if you don't care during dev or something.
const app: ChooApp<Event, Model> = choo();
app.use(counterStore);
app.route('/', mainView);
app.mount('body');

function mainView (state, emit) {
    return html`
        <body>
            <main class="app">
                <h1>Counter</h1>
                <p>Click count: ${ state.counter }!</p>
                <button onclick=${ () => emit('increment', 1) }>Increment</button>
                <button onclick=${ () => emit('decrement', 1) }>Decrement</button>
            </main>
        </body>
    `;
}

function counterStore(state, emitter) {
    state.counter = 0;

    emitter.on('increment', increment);
    emitter.on('decrement', decrement);
    emitter.on('*', (name, data) => {
        console.log('Event:', name, data);
    });

    function increment(payload: Delta) {
        state.counter += payload;
        emitter.emit('render');
    }

    function decrement(payload: Delta) {
        state.counter -= payload;
        emitter.emit('render');
    }
}
