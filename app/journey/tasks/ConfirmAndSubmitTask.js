const TaskBase = require('../TaskBase');

module.exports = class ConfirmAndSubmitTask extends TaskBase {
  constructor(priorTasks) {
    super();
    this.priorTasks = priorTasks;
  }

  get title() { return 'Confirm'; }

  get defaultEntryPoint() { return '/confirm'; }

  get prerequisites() { return this.priorTasks; }

  completedFor(session) { return session.formsCompleted !== undefined; }
}
