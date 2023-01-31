import { format } from "date-fns";
import Todo from "./todo";
import { Project, projectList } from "./projects";

const Helpers = (() => {
  const createDOMTodo = (todo) => {
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

  const closeTodoForm = () => document.querySelector("#form-todo").remove();

  const closeProjectForm = () => {
    document.querySelector("#new-project").classList.remove("active");
    while (document.querySelector(".proj-form-btns").firstElementChild) {
      document.querySelector(".proj-form-btns").firstElementChild.remove();
    }
    document.querySelector("#new-project").value = "";
    const error = document.querySelector(".form-project #project-error");
    if (error) error.remove();
  };

  const requireProjectTitle = (code) => {
    const curError = document.querySelector("#project-error");
    if (curError) {
      const currentErrorCode = curError.dataset.err;
      if (+currentErrorCode !== code) curError.remove();
      else return;
    }
    const projForm = document.querySelector(".form-project");
    const error = document.createElement("p");
    error.dataset.err = code;
    projForm.appendChild(error);
    error.id = "project-error";
    error.textContent = code
      ? "A project with this name already exists"
      : "Project must have a title";
  };

  const addProject = () => {
    const projInput = document.querySelector("#new-project");
    const newProj = new Project(projInput.value);
    if (projectList.getProject(newProj)) {
      requireProjectTitle(1);
      return;
    }
    if (!newProj.name) {
      requireProjectTitle(0);
      return;
    }
    projectList.addProject(newProj);

    const li = document.createElement("li");
    li.textContent = newProj.name;
    li.id = newProj.name;
    document.querySelector(".projects").appendChild(li);
    projInput.value = "";
    closeProjectForm();
  };

  const requireTodoTitle = () => {
    document.querySelector("#form-todo").classList.add("title-error");
  };

  const createTodo = (info) => {
    const [title, project, date, desc, priority] = info;
    const todo = new Todo(title, desc, date, priority);
    projectList.getProjectByName(project).addTodo(todo);
    if (projectList.getCurrentProject().name === project) {
      const div = createDOMTodo(todo);
      document.querySelector(".content").appendChild(div);
    }
  };

  const getFormInfo = () => {
    const { children } = document.querySelector("#form-todo");
    if (!children.item(0).value) {
      requireTodoTitle();
      return;
    }
    const info = [];
    for (let i = 0; i < 4; i += 1) {
      info.push(children.item(i).value);
    }
    const btns = Array.from(document.querySelectorAll(".form-priority button"));
    const priority = btns.filter((btn) => btn.classList.contains("selected"));
    if (priority.length) info.push(+priority[0].dataset.prio);
    else info.push(0);
    document.querySelector("#form-todo").classList.remove("title-error");
    createTodo(info);
  };

  const createTodoForm = () => {
    const formDiv = document.createElement("div");

    const createTitle = () => {
      const titleInput = document.createElement("input");
      const attributes = {
        type: "text",
        name: "form-todo-title",
        id: "form-todo-title",
        autocomplete: "off",
        placeholder: "Task title",
      };
      titleInput.autofocus = true;
      Object.keys(attributes).forEach((attr) => {
        titleInput.setAttribute(`${attr}`, attributes[attr]);
      });
      formDiv.appendChild(titleInput);
    };

    const createDesc = () => {
      const textarea = document.createElement("textarea");
      textarea.id = "form-todo-desc";
      textarea.placeholder = "Description here...";
      textarea.cols = "20";
      textarea.rows = "3";
      formDiv.appendChild(textarea);
    };

    const createDate = () => {
      const dateInput = document.createElement("input");
      dateInput.setAttribute("type", "date");
      const date = format(new Date(), "yyyy-MM-dd");
      dateInput.id = "form-todo-date";
      dateInput.name = "form-todo-date";
      dateInput.setAttribute("value", date);
      dateInput.setAttribute("min", date);
      formDiv.appendChild(dateInput);
    };

    const createProjectSelect = () => {
      const select = document.createElement("select");
      select.id = "form-todo-project";
      select.name = "form-todo-project";
      const projects = projectList.getProjectListNames();
      projects.forEach((proj) => {
        const option = document.createElement("option");
        option.value = proj;
        option.textContent = proj;
        if (proj.value === "Inbox") option.selected = true;
        select.appendChild(option);
      });
      formDiv.appendChild(select);
    };

    const cancelBtn = () => {
      const btn = document.createElement("button");
      btn.addEventListener("click", closeTodoForm);
      btn.textContent = "Cancel";
      formDiv.appendChild(btn);
    };

    const createBtn = () => {
      const btn = document.createElement("button");
      btn.addEventListener("click", getFormInfo);
      btn.textContent = "Create";
      formDiv.appendChild(btn);
    };

    const createPriority = () => {
      const div = document.createElement("div");
      div.classList.add("form-priority");
      const label = document.createElement("p");
      label.textContent = "Priority";
      const low = document.createElement("button");
      low.textContent = "Low";
      low.dataset.prio = "1";
      const medium = document.createElement("button");
      medium.textContent = "Medium";
      medium.dataset.prio = "2";
      const high = document.createElement("button");
      high.textContent = "High";
      high.dataset.prio = "3";
      div.append(label, low, medium, high);
      formDiv.appendChild(div);
    };

    createTitle();
    createProjectSelect();
    createDate();
    createDesc();
    createPriority();
    cancelBtn();
    createBtn();
    return formDiv;
  };

  return { createTodoForm, addProject, closeProjectForm, createDOMTodo };
})();

export default Helpers;
