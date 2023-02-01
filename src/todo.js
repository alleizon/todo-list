export default class Todo {
  constructor(title, desc, dueDate, priority) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  markCompleted() {
    this.completed = !this.completed;
  }
}
