// @flow

var css = require('sheetify');
var html = require('choo/html');
var choo = require('choo');

// const prefix = css`
//   :host > h1 { font-size: 12rem }
// `;
 
css('todomvc-common/base.css');
css('todomvc-app-css/index.css');

type AppEvent = 'log:debug'
                | 'todos:create'
                | 'todos:update'
                | 'todos:delete'
                | 'todos:edit'
                | 'todos:unedit'
                | 'todos:toggle'
                | 'todos:toggleAll'
                | 'todos:deleteCompleted';

type TodoItem = {
    id: number;
    editing: boolean;
    done: boolean;
    name: string;
}

type TodoModel = {
    todos: {
        idCounter: number;
        active: TodoItem[];
        done: TodoItem[];
        all: TodoItem[];
    }
}

const app: ChooApp<AppEvent, TodoModel> = choo();

app.use((state, emitter) => {
    emitter.emit('render');
});


// if (process.env.NODE_ENV !== 'production') {
//     // var persist = require('choo-persist');
//     // var logger = require('choo-log');
//     // app.use(persist());
//     // app.use(logger());
// }
// app.use(expose());
app.use(todoStore());

app.route('/', mainView);
app.route('#active', mainView);
app.route('#completed', mainView);
app.mount('body');

function mainView(state, emit) {
    emit('log:debug', 'Rendering main view');
    return html`
        <body>
        <section class="todoapp">
            ${ Header(state, emit) }
            ${ TodoList(state, emit) }
            ${ Footer(state, emit) }
        </section>
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p>choo by <a href="https://yoshuawuyts.com/">Yoshua Wuyts</a></p>
            <p>Created by <a href="http://shuheikagawa.com">Shuhei Kagawa</a></p>
        </footer>
        </body>
    `;
}

function todoStore() {
    return function(state, emitter) {
        var localState = state.todos;

        if (!localState) {
            localState = (state.todos = {});

            localState.active = [];
            localState.done = [];
            localState.all = [];

            localState.idCounter = 0;
        }

        emitter.on('*', function(name, data) {
            console.log('Got event', name, data);
        });

        emitter.on('DOMContentLoaded', function() {
            emitter.emit('log:debug', 'Loading todos model');

            // CRUD
            emitter.on('todos:create', create);
            emitter.on('todos:update', update);
            emitter.on('todos:delete', del);

            // Shorthand
            emitter.on('todos:edit', edit);
            emitter.on('todos:unedit', unedit);
            emitter.on('todos:toggle', toggle);
            emitter.on('todos:toggleAll', toggleAll);
            emitter.on('todos:deleteCompleted', deleteCompleted);
        });

        function create(name) {
            var item = {
                id: localState.idCounter,
                editing: false,
                done: false,
                name: name,
            };

            localState.idCounter += 1;
            localState.active.push(item);
            localState.all.push(item);
            emitter.emit('render');
        }

        function edit(id) {
            localState.all.forEach(function(todo) {
                if (todo.id === id) {
                    todo.editing = true;
                }
            });
            emitter.emit('render');
        }

        function unedit(id) {
            localState.all.forEach(function(todo) {
                if (todo.id === id) {
                    todo.editing = false;
                }
            });
            emitter.emit('render');
        }

        function update(newTodo: TodoItem) {
            var todo = localState.all.filter(function(todo) {
                return todo.id === newTodo.id;
            })[0];

            if (newTodo.done && todo.done === false) {
                localState.active.splice(localState.active.indexOf(todo), 1);
                localState.done.push(todo);
            }
            else if (newTodo.done === false && todo.done) {
                localState.done.splice(localState.done.indexOf(todo), 1);
                localState.active.push(todo);
            }

            // mutate(todo, newTodo);
            emitter.emit('render');
        }

        function del(id) {
            var i = null;
            // var todo = null;
            state.todos.all.forEach(function(_todo, j) {
                if (_todo.id === id) {
                    i = j;
                    // todo = _todo;
                }
            });
            if (i !== null) {
                state.todos.all.splice(i, 1);
            }

            // if (todo.done) {
            //     var done = localState.done;
            //     var doneIndex = done[todo];
            //     done.splice(doneIndex, 1);
            // } else {
            //     var active = localState.active;
            //     var activeIndex = active[todo];
            //     active.splice(activeIndex, 1);
            // }
            emitter.emit('render');
        }

        function deleteCompleted() {
            var done = localState.done;
            done.forEach(function(todo) {
                var index = state.todos.all.indexOf(todo);
                state.todos.all.splice(index, 1);
            });
            localState.done = [];
            emitter.emit('render');
        }

        function toggle(id) {
            var todo = localState.all.filter(function(todo) {
                return todo.id === id;
            })[0];
            var done = todo.done;
            todo.done = !done;
            var arr = done ? localState.done : localState.active;
            var target = done ? localState.active : localState.done;
            var index = arr.indexOf(todo);
            arr.splice(index, 1);
            target.push(todo);
            emitter.emit('render');
        }

        function toggleAll() {
            var todos = localState.all;
            var allDone = localState.all.length &&
                localState.done.length === localState.all.length;

            todos.forEach(function(todo) {
                todo.done = !allDone;
            });

            if (allDone) {
                localState.done = [];
                localState.active = localState.all;
            }
            else {
                localState.done = localState.all;
                localState.active = [];
            }

            emitter.emit('render');
        }
    };
}

function Footer(state, emit) {
    var filter = window.location.hash.replace(/^#/, '');
    var activeCount = state.todos.active.length;
    var hasDone = state.todos.done.length;

    return html`
        <footer class="footer">
            <span class="todo-count">
                <strong>${ activeCount }</strong>
                item${ state.todos.all === 1 ? '' : 's' } left
            </span>
            <ul class="filters">
                ${ filterButton('All', '', filter, emit) }
                ${ filterButton('Active', 'active', filter, emit) }
                ${ filterButton('Completed', 'completed', filter, emit) }
            </ul>
            ${ hasDone ? deleteCompleted(emit) : '' }
        </footer>
  `;

    function filterButton(name, filter, currentFilter) {
        var filterClass = filter === currentFilter ? 'selected' : '';

        var uri = `#${ name.toLowerCase() }`;
        if (uri === '#all') {
            uri = '/';
        }
        return html`
            <li>
                <a href=${ uri } class=${ filterClass }>
                ${ name }
                </a>
            </li>
        `;
    }

    function deleteCompleted(emit) {
        return html`
            <button class="clear-completed" onclick=${ deleteAllCompleted }>
                Clear completed
            </button>
    `;

        function deleteAllCompleted() {
            emit('todos:deleteCompleted');
        }
    }
}

function Header(todos, emit) {
    return html`
        <header class="header">
        <h1>todos</h1>
        <input class="new-todo"
            autofocus
            placeholder="What needs to be done?"
            onkeydown=${ createTodo } />
        </header>
  `;

    function createTodo(e) {
        if (e.keyCode === 13) {
            emit('todos:create', e.target.value);
            e.target.value = '';
        }
    }
}

function TodoItemView(todo, emit) {
    return html`
        <li class=${ classList({ completed: todo.done, editing: todo.editing }) }>
            <div class="view">
                <input
                type="checkbox"
                class="toggle"
                checked="${ todo.done }"
                onchange=${ toggle } />
                <label ondblclick=${ edit }>${ todo.name }</label>
                <button
                class="destroy"
                onclick=${ destroy }
                ></button>
            </div>
            <input
                class="edit"
                value=${ todo.name }
                onkeydown=${ handleEditKeydown }
                onblur=${ update } />
        </li>
  `;

    function toggle() {
        emit('todos:toggle', todo.id);
    }

    function edit() {
        emit('todos:edit', todo.id);
    }

    function destroy() {
        emit('todos:delete', todo.id);
    }

    function update(evt) {
        emit('todos:update', {
            id: todo.id,
            editing: false,
            name: evt.target.value,
        });
    }

    function handleEditKeydown(evt) {
        if (evt.keyCode === 13) {
            update(evt);
        } // Enter
        else if (evt.code === 27) {
            emit('todos:unedit');
        } // Escape
    }

    function classList(classes) {
        var str = '';
        var keys = Object.keys(classes);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var val = classes[key];
            if (val) {
                str += `${ key } `;
            }
        }
        return str;
    }
}

function TodoList(state, emit) {
    var filter = window.location.hash.replace(/^#/, '');
    var items = filter === 'completed'
        ? state.todos.done
        : filter === 'active' ? state.todos.active : state.todos.all;

    var allDone = state.todos.done.length === state.todos.all.length;

    var nodes = items.map(function(todo) {
        return TodoItemView(todo, emit);
    });

    return html`
        <section class="main">
            <input
                class="toggle-all"
                type="checkbox"
                checked=${ allDone }
                onchange=${ toggleAll }/>
            <label for="toggle-all" style="display: none;">
                Mark all as done
            </label>
            <ul class="todo-list">
                ${ nodes }
            </ul>
        </section>
    `;

    function toggleAll() {
        emit('todos:toggleAll');
    }
}
