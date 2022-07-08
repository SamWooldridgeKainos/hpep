const TaskBase = require('../taskBase');

module.exports = class ConfirmEmailTask extends TaskBase {
  get title() { return 'Confirm your email address'; }

  get defaultEntryPoint() { return '/personal-details/confirm-email'; }

  checkYourAnswersSummaryFor(session) {
    return [
      {
        label: 'Email address',
        value: `${session.firstName}.${session.lastName}@example.com`,
        change: false
      }
    ];
  }

  completedFor(session) { return session.confirmEmail !== undefined; }
}
