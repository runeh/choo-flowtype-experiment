# choo 5 flowtype experiments

Experimenting with flow on top of the choo 5 api.

## Usage

Check out and `npm install`.

Run the different experiments with:

- `npm run start-todo`
- `npm run start-counter`
- `npm run start-async-counter`
- `npm run start-title`

Run flow checker with `npm run check`.

## Example:

```
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
        console.log(name, data);
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
```

## Cool:

- Type checking of event names and model data. - Means we get compile time
  errors if using `emitter.on(` and `emitter.emit(` with undefined event names.
- Type checking of state - state manipulated inside a `use(` callback can not
  violate the type of the state object.
- Type checking `emit(` inside of views.

## Lame:

- Poor / confusing error messages
- Can't infer payload types of event handlers. Must be explicit, or use the
  default `any` type for data payload.
- Haven't figured out if it's possible to get the tagged templates to be type
  checked.
