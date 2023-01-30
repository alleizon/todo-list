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
    if (list.some((e) => e.name.toLowerCase() === proj.name.toLowerCase()))
      return; // put in DOM

    list.push(proj);
  };

  const removeProject = (proj) => {
    if (list.includes(proj)) {
      const index = list.indexOf(proj);
      list.splice(index, 1);
    }
  };

  const getProject = (proj) => list.find((el) => el.name === proj);
  const getCurProj = () => curProj;

  const getProjectListNames = () => list.map((project) => project.name);

  // debug
  const addProjx = (() => {
    const a = new Project("a");
    const b = new Project("b");
    addProject(a);
    addProject(b);
  })();
  const logList = () => console.log(curProj.todos);

  return {
    addProject,
    removeProject,
    getProject,
    getProjectListNames,
    getCurProj,

    logList,
  };
})();

export { Project, projectList };
