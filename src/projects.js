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
  const today = new Project("Today");
  const week = new Project("This week");
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

  const getTodayTodos = () => {
    const todayD = new Date();
    const [date, month, year] = [
      todayD.getDate(),
      todayD.getMonth(),
      todayD.getFullYear(),
    ];
    const todayTodos = [];
    list.forEach((proj) => {
      const filtered = proj.todos.filter(
        (todo) =>
          todo.dueDate.getDate() === date &&
          todo.dueDate.getMonth() === month &&
          todo.dueDate.getFullYear() === year
      );
      if (filtered.length) todayTodos.push(filtered);
    });
    return todayTodos.flat();
  };

  const getWeekTodos = () => {
    const todayD = new Date();
    todayD.setHours(0);
    todayD.setMinutes(0);
    todayD.setSeconds(0);
    const nextWeek = new Date(todayD);
    nextWeek.setDate(todayD.getDate() + 7);
    nextWeek.setHours(23);
    nextWeek.setMinutes(59);
    nextWeek.setSeconds(59);
    const todos = [];
    list.forEach((proj) => {
      const filtered = proj.todos.filter(
        (todo) =>
          todo.dueDate > todayD.getTime() && todo.dueDate < nextWeek.getTime()
      );
      if (filtered.length) todos.push(filtered);
    });
    return todos.flat();
  };

  const getProjectListNames = () => list.map((project) => project.name);
  const getCurrentProject = () => curProj;

  const updateCurrentProject = (proj) => {
    if (typeof proj === "string") {
      curProj = proj === "today" ? today : week;
      return;
    }
    curProj = proj;
  };

  // debug
  const addInboxTodos = (() => {
    const todo1 = new Todo("test1", "", new Date(), 1);
    const todo2 = new Todo("test2", "", new Date(), 0);
    const todo3 = new Todo("test3", "", new Date(), 2);
    inbox.addTodo(todo1);
    inbox.addTodo(todo2);
    inbox.addTodo(todo3);
  })();

  (() => {
    const proj1 = new Project("proj1");
    const proj2 = new Project("Proj2");
    const proj3 = new Project("proj3");
    addProject(proj1);
    addProject(proj2);
    addProject(proj3);
  })();

  const logList = () => console.log(list);

  return {
    addProject,
    removeProject,
    getProject,
    getProjectByName,
    getProjectListNames,
    getCurrentProject,
    getTodayTodos,
    getWeekTodos,
    updateCurrentProject,
    getInbox,

    logList,
  };
})();

export { Project, projectList };
