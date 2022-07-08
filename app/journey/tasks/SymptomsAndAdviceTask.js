const TaskBase = require('../taskBase');

module.exports = class SymptomsAndAdviceTask extends TaskBase {
  get title() { return 'Symptoms and advice'; }

  completedFor(session) { return session.symptoms !== undefined; }
}
