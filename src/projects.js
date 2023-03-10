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

  findTodo(date) {
    return this.todos.find((todo) => todo.dueDate.getTime() === date.getTime());
  }
}

const projectList = (() => {
  const list = [];
  const today = new Project("Today");
  const week = new Project("This week");
  let curProj;

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
  const getInbox = () => list[0];

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
      if (filtered.length) {
        filtered.unshift(proj);
        todayTodos.push(filtered);
      }
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
      if (filtered.length) {
        filtered.unshift(proj);
        todos.push(filtered);
      }
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

  const updateStoredList = (storedList) => {
    storedList.forEach((proj) => list.push(proj));
  };

  const initList = () => {
    const inbox = new Project("Inbox");
    curProj = inbox;
    list.push(inbox);
  };

  const getList = () => list;

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
    updateStoredList,
    initList,
    getList,
  };
})();

export { Project, projectList };
