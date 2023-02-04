export default class Todo {
  constructor(title, desc, dueDate, priority, completed = false) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

  markCompleted() {
    this.completed = !this.completed;
  }
}
