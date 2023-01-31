import { format } from "date-fns";
import Todo from "./todo";
import { Project, projectList } from "./projects";
import Helpers from "./domHelpers";

const DOM = (() => {
  const removeContent = () => {
    const content = document.querySelector(".content");
    while (content.firstElementChild) content.firstElementChild.remove();
  };

  const createProjectForm = () => {
    if (document.querySelector("#new-project").classList.contains("active"))
      return;
    const btnsDiv = document.querySelector(".proj-form-btns");
    document.querySelector("#new-project").classList.add("active");
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", Helpers.closeProjectForm);
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.addEventListener("click", Helpers.addProject);
    btnsDiv.append(closeBtn, addBtn);
  };

  const createTodoForm = () => {
    const header = document.querySelector("header");
    if (document.querySelector("#form-todo")) return;
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
    return div;
  };

  const renderInbox = () => {
    removeContent();
    const content = document.querySelector(".content");
    const proj = projectList.getInbox();
    proj.todos.forEach((element) => {
      const div = renderTodo(element);
      content.appendChild(div);
    });
  };

  const renderToday = () => {
    removeContent();
    // TODO
  };

  const renderWeek = () => {
    removeContent();
    // TODO
  };

  const renderProjectsList = () => {
    const list = projectList.getProjectListNames().slice(1);
    const projects = document.querySelector(".projects");
    list.forEach((projName) => {
      const li = document.createElement("li");
      li.textContent = projName;
      li.id = projName;
      projects.appendChild(li);
    });
  };
  renderProjectsList();

  // debug

  const log = () => {
    console.log(projectList.getProjectListNames());
  };
  return {
    renderInbox,
    renderToday,
    renderWeek,
    renderProjectsList,
    createTodoForm,
    createProjectForm,
    log,
  };
})();

const ELS = (() => {
  const init = () => {
    document
      .querySelector("#add-todo")
      .addEventListener("click", DOM.createTodoForm);
    document
      .querySelector("button#add-project")
      .addEventListener("click", DOM.createProjectForm);
    document
      .querySelector(".side-pannel .inbox #inbox-link")
      .addEventListener("click", DOM.renderInbox);
    document
      .querySelector(".side-pannel .inbox #today-link")
      .addEventListener("click", DOM.renderToday);
    document
      .querySelector(".side-pannel .inbox #week-link")
      .addEventListener("click", DOM.renderWeek);
  };

  return { init };
})();

export { DOM, ELS };
