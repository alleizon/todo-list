import { format } from "date-fns";
import Todo from "./todo";
import { Project, projectList } from "./projects";
import Helpers from "./domHelpers";

const DOM = (() => {
  const createTodoForm = () => {
    const header = document.querySelector("header");
    const formDiv = Helpers.createTodoForm();
    formDiv.id = "form-todo";
    header.appendChild(formDiv);
  };

  const priorityStyling = (priority, objPriority) => {
    switch (objPriority) {
      case 1:
        priority.classList.add("low");
        break;
      case 2:
        priority.classList.add("medium");
        break;
      case 3:
        priority.classList.add("high");
        break;
      default:
        priority.classList.add("none");
        break;
    }
  };

  const renderTodo = (todo) => {
    const div = document.createElement("div");

    const title = document.createElement("h1");
    title.textContent = todo.title;
    const dueDate = document.createElement("p");
    dueDate.textContent = todo.dueDate;
    const desc = document.createElement("p");
    desc.textContent = todo.desc;
    const priority = document.createElement("button");
    priorityStyling(priority, todo.priority);
    const notes = document.createElement("div");
    // render notes
    const completed = document.createElement("button");
    // buton styling

    div.append(title, dueDate, desc, priority, notes, completed);
  };

  const renderInbox = () => {
    const proj = projectList.getProjectList();
    proj.todos.forEach((element) => {
      renderTodo(element);
    });
  };

  // debug

  const log = () => {
    console.log(projectList.getProjectListNames());
  };
  return { createTodoForm, log };
})();

const ELS = (() => {
  const init = () => {
    const todoAddBtn = document.querySelector("#add-todo");
    todoAddBtn.addEventListener("click", DOM.createTodoForm);
  };

  return { init };
})();

export { DOM, ELS };
