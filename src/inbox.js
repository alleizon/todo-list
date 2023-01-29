const Inbox = (() => {
  const todos = [];

  const addTodo = (todo) => {
    todos.push(todo);
  };

  const removeTodo = (todo) => {
    const index = todo.id;
    todos.splice(index, 1);
    for (let i = index; i < todos.length; i += 1) {
      todos[i].lowerIndex();
    }
  };

  const getTodos = () => todos;

  return { addTodo, removeTodo, getTodos };
})();

export default Inbox;
