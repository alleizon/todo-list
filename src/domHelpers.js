import { format } from "date-fns";
import Todo from "./todo";
import { projectList } from "./projects";

const Helpers = (() => {
  const closeTodoForm = () => document.querySelector("#form-todo").remove();

  const requireTitle = () => {
    document.querySelector("#form-todo").classList.add("title-error");
  };

  const createTodo = (info) => {
    const [title, project, date, desc, priority] = info;
    const todo = new Todo(title, desc, date, priority);
    projectList.getProject(project).addTodo(todo);
  };

  const getFormInfo = () => {
    const { children } = document.querySelector("#form-todo");
    if (!children.item(0).value) {
      requireTitle();
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

  return { createTodoForm };
})();

export default Helpers;
