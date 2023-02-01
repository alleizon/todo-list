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
    addBtn.addEventListener("click", ELS.newProj);
    btnsDiv.append(closeBtn, addBtn);
  };

  const createTodoForm = () => {
    const header = document.querySelector("header");
    if (document.querySelector("#form-todo")) return;
    const formDiv = Helpers.createTodoForm();
    formDiv.id = "form-todo";
    header.appendChild(formDiv);
  };

  const renderInbox = () => {
    removeContent();
    const content = document.querySelector(".content");
    const inbox = projectList.getInbox();
    projectList.updateCurrentProject(inbox);
    inbox.todos.forEach((element, index) => {
      const div = Helpers.createDOMTodo(element, index);
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

  const renderProject = (e) => {
    removeContent();
    const content = document.querySelector(".content");
    const projectName = e.target.id;
    const proj = projectList.getProjectByName(projectName);
    projectList.updateCurrentProject(proj);
    proj.todos.forEach((element, index) => {
      const div = Helpers.createDOMTodo(element, index);
      content.appendChild(div);
    });
  };

  const renderProjectsList = () => {
    // TODO: add initial event listeners for storage
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

  const log = () => {};
  return {
    renderInbox,
    renderToday,
    renderWeek,
    renderProject,
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

  const newProj = () => {
    Helpers.addProject();
    const addedProj =
      document.querySelector(".projects").lastElementChild.firstElementChild;
    addedProj.addEventListener("click", DOM.renderProject);
  };

  return { init, newProj };
})();

export { DOM, ELS };
