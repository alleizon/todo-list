export default class Todo {
  completed = false;

  notes = [];

  constructor(title, desc, dueDate, priority) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  addNote(note) {
    this.notes.push(note);
  }

  markCompleted() {
    this.completed = !this.completed;
  }
}
