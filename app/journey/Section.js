module.exports = class Section {
  constructor(title, tasks) {
    this.title = title;
    this.tasks = tasks;
    this.taskIndex = tasks.reduce((o, task, index) => ({ ...o, [task.id]: index }), {})
    this.completed = false;
  }

  // Checks whether or not the current user has completed the section
  completedFor(session) {
    this.completed = this.completed || this.tasks.every(task => task.completedFor(session));
    return this.completed;
  }

  // Determines the next task for the current user
  nextTaskFor(session) {
    return this.tasks.find(task => !task.completedFor(session))
  }

  // Summarises the section's tasks (including completion statuses)
  summary(session) {
    return {
      title: this.title,
      tasks: this.tasks.map(task => task.summary(session)),
      completed: this.completedFor(session)
    };
  }

  getTask(taskId) {
    return this.tasks[this.taskIndex[taskId]];
  }
}
