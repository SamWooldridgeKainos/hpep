const TaskBase = require('../taskBase');
const strUtils = require('../../../lib/string-utils');

module.exports = class ProxyDetailsTask extends TaskBase {
  get title() { return 'Proxy details'; }

  get defaultEntryPoint() { return '/personal-details/proxy'; }

  checkYourAnswersSummaryFor(session) {
    return [
      {
        label: 'Proxy',
        value: strUtils.toSentenceCase(session.isProxy),
        change: this.defaultEntryPoint
      }
    ];
  }

  completedFor(session) { return session.isProxy !== undefined; }
}
