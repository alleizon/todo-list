import { compareAsc } from "date-fns";
import { projectList } from "./projects";
import Helpers from "./domHelpers";
import Storage from "./storage";

const DOM = (() => {
  const removeContent = () => {
    const content = document.querySelector(".content");
    while (content.firstElementChild) content.firstElementChild.remove();
    document.querySelector("header").classList.remove("expanded");
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
    header.classList.add("expand");
    setTimeout(() => {
      formDiv.classList.add("active");
    }, 100);
  };

  const renderInbox = () => {
    removeContent();
    Helpers.closeTodoForm();
    document.querySelector("#project-header").textContent = "Inbox";
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
    Helpers.closeTodoForm();
    document.querySelector("#project-header").textContent = "Today";
    projectList.updateCurrentProject("today");
    const todos = projectList.getTodayTodos();
    const filtered = todos.filter((element) => element.dueDate);
    if (filtered.length) {
      filtered.forEach((todo, index) => {
        const div = Helpers.createDOMTodo(
          todo,
          index,
          Helpers.getProjectFromUnfilteredArray(todo, todos)
        );
        document.querySelector(".content").appendChild(div);
      });
    }
  };

  const renderWeek = () => {
    removeContent();
    Helpers.closeTodoForm();
    document.querySelector("#project-header").textContent = "This week";
    projectList.updateCurrentProject("week");
    const todos = projectList.getWeekTodos();
    const filtered = todos.filter((todo) => todo.dueDate);
    if (filtered.length) {
      filtered.sort((a, b) => compareAsc(a.dueDate, b.dueDate));
      filtered.forEach((todo, index) => {
        const div = Helpers.createDOMTodo(
          todo,
          index,
          Helpers.getProjectFromUnfilteredArray(todo, todos)
        );
        document.querySelector(".content").appendChild(div);
      });
    }
  };

  const renderProject = (e) => {
    removeContent();
    Helpers.closeTodoForm();
    const content = document.querySelector(".content");
    const projectName = e.target.id;
    const proj = projectList.getProjectByName(projectName);
    document.querySelector("#project-header").textContent = proj.name;
    projectList.updateCurrentProject(proj);
    proj.todos.forEach((element, index) => {
      const div = Helpers.createDOMTodo(element, index);
      content.appendChild(div);
    });
  };

  const renderProjectsList = () => {
    const createWrapper = (li) => {
      const div = document.createElement("div");
      div.classList.add("project");
      const btn = document.createElement("button");
      btn.innerHTML = '<i class="fa-solid fa-ban"></i>';
      btn.addEventListener("click", Helpers.removeProject);
      div.append(li, btn);
      return div;
    };
    const list = projectList.getProjectListNames().slice(1);
    const projects = document.querySelector(".projects");
    list.forEach((projName) => {
      const li = document.createElement("li");
      li.textContent = projName;
      li.id = projName;
      projects.appendChild(createWrapper(li));
      ELS.addLocalStorageProject(li);
    });
  };
  renderProjectsList();

  return {
    renderInbox,
    renderToday,
    renderWeek,
    renderProject,
    renderProjectsList,
    createTodoForm,
    createProjectForm,
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

    const storageList = Storage.getStorageList();
    if (storageList) {
      storageList.forEach((proj) => {
        proj.todos.forEach((todo) => {
          const cpy = todo;
          cpy.dueDate = new Date(todo.dueDate);
        });
      });
      projectList.updateStoredList(storageList);
      if (storageList.length > 1) {
        DOM.renderProjectsList();
      }
    } else projectList.initList();
  };

  const addLocalStorageProject = (li) => {
    li.addEventListener("click", DOM.renderProject);
  };

  const newProj = () => {
    Helpers.addProject();
    const addedProj =
      document.querySelector(".projects").lastElementChild.firstElementChild;
    if (addedProj) addedProj.addEventListener("click", DOM.renderProject);
  };

  return { init, newProj, addLocalStorageProject };
})();

export { DOM, ELS };
