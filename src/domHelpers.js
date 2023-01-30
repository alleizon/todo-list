import { format } from "date-fns";
import Todo from "./todo";
import { projectList } from "./projects";

const Helpers = (() => {
  const closeTodoForm = () => document.querySelector("#form-todo").remove();

  const createTodo = () => {
    const todo = new Todo();
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
      btn.addEventListener("click", createTodo);
      btn.textContent = "Create";
      formDiv.appendChild(btn);
    };

    const createPriority = () => {
      const div = document.createElement("div");
      const label = document.createElement("p");
      label.textContent = "Priority";
      const low = document.createElement("button");
      low.textContent = "Low";
      const medium = document.createElement("button");
      medium.textContent = "Medium";
      const high = document.createElement("button");
      high.textContent = "High";
      div.append(label, low, medium, high);
      formDiv.appendChild(div);
    };

    createTitle();
    createDate();
    createProjectSelect();
    createPriority();
    cancelBtn();
    createBtn();
    return formDiv;
  };

  return { createTodoForm };
})();

export default Helpers;
