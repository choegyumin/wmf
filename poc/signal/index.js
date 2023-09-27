let _idCounter = 0;
function generateId(prefix = "") {
  return prefix + _idCounter++;
}

function createSignal(initialValue) {
  let value = initialValue;

  const listeners = [];

  const state = () => value;

  const setState = (newValue) => {
    const prevValue = value;
    value = newValue;
    listeners.forEach((listener) => listener(prevValue, newValue));
  };

  const subscribeState = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) listeners.splice(index, 1);
    };
  };

  return [state, setState, subscribeState];
}

function createHTML(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

function childrenMap(
  container,
  items,
  render,
  { keyFn = () => generateId() } = {}
) {
  const children = new Map();

  function update() {
    const newChildren = new Map();

    items().forEach((item, index) => {
      const key = keyFn(item, index);
      const existingChild = children.get(key);
      if (existingChild) return newChildren.set(key, existingChild);
      const newChild = render(item, index);
      container.appendChild(newChild.root);
      newChildren.set(key, newChild);
    });

    children.forEach((child, key) => {
      if (newChildren.has(key)) return;
      container.removeChild(child.root);
      child.cleanup?.();
    });

    children.clear();

    newChildren.forEach((value, key) => {
      children.set(key, value);
    });
  }

  update();

  return update;
}

function Todo({ value, onDelete }) {
  const root = createHTML(`
    <li>
      <span>${value}</span>
      <button data-delete-button>Delete</button>
    </li>
  `);

  const deleteButton = root.querySelector("[data-delete-button]");

  deleteButton.addEventListener("click", onDelete);

  function cleanup() {
    deleteButton.removeEventListener("click", handleDelete);
  }

  return { root, cleanup };
}

function TodoList() {
  const [todos, setTodos, subscribeTodos] = createSignal([]);

  function addTodo() {
    const text = prompt("New Todo:");
    if (!text) return;
    setTodos([...todos(), text]);
  }

  function deleteTodo(index) {
    const updatedTodos = todos().filter((_, i) => i !== index);
    setTodos(updatedTodos);
  }

  const root = createHTML(`
    <section>
      <button data-add-button>Add Todo</button>
      <ul data-todos-container></ul>
    </section>
  `);

  const addButton = root.querySelector("[data-add-button]");
  const todosContainer = root.querySelector("[data-todos-container]");

  const updateTodosContainerChildren = childrenMap(
    todosContainer,
    todos,
    (todo, index) =>
      Todo({
        value: todo,
        onDelete: () => {
          deleteTodo(index);
          updateTodosContainerChildren();
        },
      })
  );

  subscribeTodos(updateTodosContainerChildren);

  addButton.addEventListener("click", addTodo);

  return root;
}

function App() {
  const root = createHTML(`<main></main>`);

  root.appendChild(TodoList());

  return root;
}

document.body.innerHTML = '<div id="app"></div>';
document.getElementById("app").appendChild(App());
