export default class Todo {
  completed = false;

  notes = [];

  constructor(id, title, desc, dueDate, priority) {
    this.id = id;
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

  lowerIndex() {
    this.id -= 1;
  }
}
