const TaskBase = require('../taskBase');

module.exports = class AccommodationTypeTask extends TaskBase {
  get title() { return 'Type of accommodation'; }

  get defaultEntryPoint() { return '/accommodation/type'; }

  completedFor(session) { return session.addressLine1 !== undefined; }
}
