const TaskBase = require('../taskBase');

module.exports = class ConfirmPhoneNumberTask extends TaskBase {
   get title() { return 'Confirm your phone number'; }

   get defaultEntryPoint() { return '/personal-details/confirm-phone'; }

   checkYourAnswersSummaryFor(session) {
      return [
        {
          label: 'Telehone number',
          value: session.phone,
          change: this.defaultEntryPoint
        }
      ];
    }

   completedFor(session) { return session.phone !== undefined; }
}
