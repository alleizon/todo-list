import { Project, projectList } from "./projects";
import Todo from "./todo";

const Storage = (() => {
  const restoreTodoObject = (todo) => {
    const values = Object.values(todo);
    return new Todo(values[0], values[1], values[2], values[3], values[4]);
  };

  const restoreProjectObject = (project) => {
    const newProj = new Project();
    newProj.name = project.name;
    project.todos.forEach((todo) => {
      newProj.addTodo(restoreTodoObject(todo));
    });
    return newProj;
  };

  const getStorageList = () => {
    if (localStorage.getItem("list")) {
      const parseList = JSON.parse(localStorage.getItem("list"));
      const newList = [];
      parseList.forEach((proj) => {
        newList.push(restoreProjectObject(proj));
      });
      return newList;
    }
    return null;
  };

  const storeProjects = () => {
    localStorage.setItem("list", JSON.stringify(projectList.getList()));
  };

  return { storeProjects, getStorageList };
})();

export default Storage;
