import { format, compareAsc } from "date-fns";
import Todo from "./todo";
import { Project, projectList } from "./projects";
import Storage from "./storage";

const Helpers = (() => {
  let curPriority = 0;

  const updateAddDOMIndex = (div, i) => {
    const divCopy = div;

    if (!div.nextSibling) {
      const { index } = div.dataset;
      const newIndex = +index + 1;
      divCopy.dataset.index = newIndex;
      return;
    }

    divCopy.dataset.index = +div.dataset.index + 1;
    updateAddDOMIndex(div.nextSibling, i + 1);
  };

  const updateRemoveDOMIndex = (index) => {
    const todosArray = Array.from(document.querySelectorAll(".content > div"));
    const arr = todosArray.slice(index);
    for (let i = 0; i < arr.length; i += 1) {
      arr[i].dataset.index -= 1;
    }
  };

  const getProjectFromUnfilteredArray = (todo, unfiltered) => {
    const index = unfiltered.findIndex((element) => element === todo);
    for (let i = index; i >= 0; i -= 1) {
      if (unfiltered[i] instanceof Project) return unfiltered[i].name;
    }
  };

  const completeTodo = (e) => {
    const todoDiv = e.target.parentElement;
    const index = +todoDiv.dataset.index;
    const curProject = projectList.getCurrentProject();
    if (curProject.name === "Today" || curProject.name === "This week") {
      const proj = projectList.getProjectByName(todoDiv.dataset.project);
      const time = todoDiv.dataset.ts;
      const date = new Date(+time);
      proj.findTodo(date).markCompleted();
    } else curProject.todos[index].markCompleted();
    todoDiv.classList.toggle("completed");
    Storage.storeProjects();
  };

  const removeDOMTodo = (e) => {
    const parent = e.target.parentElement;
    const { index } = parent.dataset;
    parent.remove();
    const curProject = projectList.getCurrentProject();
    if (curProject.name === "Today" || curProject.name === "This week") {
      const proj = projectList.getProjectByName(parent.dataset.project);
      const time = parent.dataset.ts;
      const date = new Date(+time);
      proj.removeTodo(proj.findTodo(date));
    } else curProject.removeTodo(curProject.todos[index]);
    updateRemoveDOMIndex(+index);
    Storage.storeProjects();
  };

  const createDOMTodo = (todo, index, projName) => {
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
    div.dataset.index = index;
    if (projName) {
      div.dataset.project = projName;
      div.dataset.ts = todo.dueDate.getTime();
    }
    if (todo.completed) div.classList.add("completed");

    const title = document.createElement("h1");
    title.textContent = todo.title;
    const dueDate = document.createElement("p");
    dueDate.textContent = format(todo.dueDate, "dd/MM/yyyy");
    const desc = document.createElement("p");
    desc.textContent = todo.desc;
    const priority = document.createElement("button");
    priorityStyling(priority, todo.priority);
    const completed = document.createElement("button");
    completed.textContent = "complete";
    completed.addEventListener("click", completeTodo);
    // buton styling
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", removeDOMTodo);

    div.append(title, dueDate, desc, priority, completed, deleteBtn);
    return div;
  };

  const closeTodoForm = () => {
    curPriority = 0;
    document.querySelector("#form-todo").remove();
  };

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

  const removeProject = (e) => {
    const parentDiv = e.target.parentElement.parentElement;
    const projectName = parentDiv.firstElementChild.id;
    projectList.removeProject(projectList.getProjectByName(projectName));
    parentDiv.remove();
    Storage.storeProjects();
  };

  const addProject = () => {
    const createWrapper = (li) => {
      const div = document.createElement("div");
      div.classList.add("project");
      const btn = document.createElement("button");
      btn.innerHTML = '<i class="fa-solid fa-ban"></i>';
      btn.addEventListener("click", removeProject);
      div.append(li, btn);
      return div;
    };

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
    Storage.storeProjects(newProj);

    const li = document.createElement("li");
    li.textContent = newProj.name;
    li.id = newProj.name;
    document.querySelector(".projects").appendChild(createWrapper(li));
    projInput.value = "";
    closeProjectForm();
  };

  const requireTodoTitle = () => {
    document.querySelector("#form-todo").classList.add("title-error");
  };

  const createTodo = (info) => {
    const appendToCurrentPage = (todo, projName) => {
      const index = document.querySelector(".content").lastElementChild
        ? +document.querySelector(".content").lastElementChild.dataset.index + 1
        : 0;
      const div = createDOMTodo(todo, index, projName);
      document.querySelector(".content").appendChild(div);
    };

    const checkTodayTodo = (date) => {
      const todayD = new Date();
      const [day, month, year] = [
        todayD.getDate(),
        todayD.getMonth(),
        todayD.getFullYear(),
      ];
      return !!(
        day === date.getDate() &&
        month === date.getMonth() &&
        year === date.getFullYear()
      );
    };

    const checkWeekTodo = (date) => {
      const todayD = new Date();
      todayD.setHours(0);
      todayD.setMinutes(0);
      todayD.setSeconds(0);
      const nextWeek = new Date(todayD);
      nextWeek.setDate(todayD.getDate() + 7);
      nextWeek.setHours(23);
      nextWeek.setMinutes(59);
      nextWeek.setSeconds(59);

      return !!(
        date.getTime() > todayD.getTime() && date.getTime() < nextWeek.getTime()
      );
    };

    const [title, project, date, desc, priority] = info;
    const todo = new Todo(title, desc, date, priority);
    const projectObj = projectList.getProjectByName(project);
    projectObj.addTodo(todo);
    Storage.storeProjects();
    if (projectList.getCurrentProject().name === project)
      appendToCurrentPage(todo);
    if (
      projectList.getCurrentProject().name === "Today" &&
      checkTodayTodo(date)
    )
      appendToCurrentPage(todo, project);
    if (
      projectList.getCurrentProject().name === "This week" &&
      checkWeekTodo(date)
    ) {
      const weekTodos = projectList.getWeekTodos();
      const filtered = weekTodos.filter((element) => element.dueDate);
      filtered.sort((a, b) => compareAsc(a.dueDate, b.dueDate));
      const index = filtered.findIndex((element) => element === todo);
      if (!document.querySelector(`[data-index="${index}"]`)) {
        appendToCurrentPage(todo, project);
        closeTodoForm();
        return;
      }
      const curDiv = document.querySelector(`[data-index="${index}"]`);
      const divToInsert = createDOMTodo(todo, index, project);
      curDiv.insertAdjacentElement("beforebegin", divToInsert);
      updateAddDOMIndex(curDiv, index);
    }

    closeTodoForm();
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
    const current = new Date();
    const [curHours, curMinutes, curSeconds] = [
      String(current.getHours()).padStart(2, "0"),
      String(current.getMinutes()).padStart(2, "0"),
      String(current.getSeconds()).padStart(2, "0"),
    ];
    const formDate = new Date(
      `${info[2]}T${curHours}:${curMinutes}:${curSeconds}.0000`
    );
    info[2] = formDate;
    const btns = Array.from(document.querySelectorAll(".form-priority button"));
    const priority = btns.filter((btn) => btn.classList.contains("selected"));
    if (priority.length) info.push(curPriority);
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
      const selectFormPriority = (e) => {
        const btn = e.target;
        const selected = +e.target.dataset.prio;
        if (curPriority === selected) {
          btn.classList.remove("selected");
          curPriority = 0;
          return;
        }
        btn.classList.add("selected");
        if (curPriority)
          document
            .querySelector(`button[data-prio="${curPriority}"]`)
            .classList.remove("selected");
        curPriority = selected;
      };

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

      low.addEventListener("click", selectFormPriority);
      medium.addEventListener("click", selectFormPriority);
      high.addEventListener("click", selectFormPriority);
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

  return {
    createTodoForm,
    addProject,
    removeProject,
    closeProjectForm,
    createDOMTodo,
    getProjectFromUnfilteredArray,
  };
})();

export default Helpers;
