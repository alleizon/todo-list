// DELETE THIS
import Todo from "./todo";

class Project {
  todos = [];

  constructor(name) {
    this.name = name;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todo) {
    if (this.todos.includes(todo)) {
      const i = this.todos.indexOf(todo);
      this.todos.splice(i, 1);
    }
  }
}

const projectList = (() => {
  const list = [];
  const inbox = new Project("Inbox");
  let curProj = inbox;
  list.push(inbox);

  const addProject = (proj) => {
    list.push(proj);
  };

  const removeProject = (proj) => {
    if (list.includes(proj)) {
      const index = list.indexOf(proj);
      list.splice(index, 1);
    }
  };

  const getProject = (proj) =>
    list.find((el) => el.name.toLowerCase() === proj.name.toLowerCase());
  const getProjectByName = (projName) =>
    list.find((el) => projName === el.name);
  const getInbox = () => inbox;
  const getProjectListNames = () => list.map((project) => project.name);
  const getCurrentProject = () => curProj;
  const updateCurrentProject = (proj) => {
    curProj = proj;
  };

  // debug
  const addInboxTodos = (() => {
    const todo1 = new Todo("test1", "", "2023-01-15", 1);
    const todo2 = new Todo("test2", "", "", 0);
    const todo3 = new Todo("test3", "", "2023-01-312", 2);
    inbox.addTodo(todo1);
    inbox.addTodo(todo2);
    inbox.addTodo(todo3);
    console.log(inbox.todos);
  })();

  (() => {
    const proj1 = new Project("proj1");
    const proj2 = new Project("Proj2");
    const proj3 = new Project("proj3");
    addProject(proj1);
    addProject(proj2);
    addProject(proj3);
  })();

  const logList = () => console.log(curProj.todos);

  return {
    addProject,
    removeProject,
    getProject,
    getProjectByName,
    getProjectListNames,
    getCurrentProject,
    updateCurrentProject,
    getInbox,

    logList,
  };
})();

export { Project, projectList };
