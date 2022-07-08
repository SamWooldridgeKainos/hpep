const AccommodationTypeTask = require('./AccommodationTypeTask');
const TaskBase = require('../taskBase');

module.exports = class WhoYouLivedWithTask extends TaskBase {
  get title() { return 'Who you lived with'; }

  get prerequisites() { return [ new AccommodationTypeTask() ]; }

  get defaultEntryPoint() { return '/accommodation/who-you-lived-with'; }

  get defaultInProgressCriteria() { return session => session.householdContactName !== undefined; }

  completedFor(session) { return session.householdContactsSubmitted !== undefined; }
}
