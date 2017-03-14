// @flow

const choo = require('choo');
const html = require('choo/html');

type TitleEvent = 'input:update';
type TitleModel = {
    title: string;
}

type UpdatePayload = {
    payload: string;
}

const app: ChooApp<TitleEvent, TitleModel> = choo();

app.use(titleStore);
app.route('/', mainView);
const tree = app.start();
if (document.body) {
    document.body.appendChild(tree);
}

function titleStore(state, emitter) {
    state.title = 'my demo app';

    emitter.on('input:update', (data: UpdatePayload) => {
        state.title = data.payload;
        window.title = state.title;
        emitter.emit('render');
    });
}

function mainView(state, emit) {
    return html`
        <main class="app">
            <h1>${ state.title }</h1>
            <label>Set the title</label>
            <input
                type="text"
                placeholder=${ state.title }
                value=${ state.title }
                oninput=${ (e) => emit('input:update', { payload: e.target.value }) }>
        </main>
  `;
};
