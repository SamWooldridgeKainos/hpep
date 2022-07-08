const TaskBase = require('../taskBase');

module.exports = class PersonalDetailsTask extends TaskBase {
  get title() { return 'Personal Details'; }

  get defaultEntryPoint() { return '/personal-details/confirm-name'; }

  get defaultInProgressCriteria() { return session => session.firstName !== undefined; }

  checkYourAnswersSummaryFor(session) {
    const rows = this.subtasks.map(subtask => subtask.checkYourAnswersSummaryFor(session)).flat();
    return [{ rows, heading: this.title }]
  }

  completedFor(session) { return session.personalDetailsSubmitted !== undefined; }
}
