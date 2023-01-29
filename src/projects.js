class Project {
  #todos = [];

  constructor(name, id) {
    this.id = id;
    this.name = name;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todo) {
    const index = todo.id;
    this.#todos.splice(index, 1);
    for (let i = index; i < this.#todos.length; i += 1) {
      this.#todos[i].id -= 1;
    }
  }
}

const ProjList = (() => {
  const projects = [];

  const addProj = (project) => {
    projects.push(project);
  };

  const removeProj = (project) => {
    const index = project.id;
    projects.splice(index, 1);
    for (let i = index; i < projects.length; i += 1) {
      projects[i].id -= 1;
    }
  };

  const getLength = () => projects.length;

  return { addProj, removeProj, getLength };
})();

export { Project, ProjList };
