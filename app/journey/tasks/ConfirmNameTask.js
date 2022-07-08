const TaskBase = require('../taskBase');

module.exports = class ConfirmNameTask extends TaskBase {
  get title() { return 'Confirm your name'; }

  get defaultEntryPoint() { return '/personal-details/confirm-name'; }

  checkYourAnswersSummaryFor(session) {
    return [
      {
        label: 'Full name',
        value: `${session.firstName} ${session.lastName}`,
        change: this.defaultEntryPoint
      }
    ];
  }

  completedFor(session) { return session.firstName !== undefined; }
}
