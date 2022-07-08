const AccommodationTypeTask = require('./AccommodationTypeTask');
const TaskBase = require('../taskBase');

module.exports = class VisitorsTask extends TaskBase {
  get title() { return 'Who visited the place you live'; }

  get prerequisites() { return [ new AccommodationTypeTask() ]; }

  get defaultEntryPoint() { return '/accommodation/visitors'; }

  get defaultInProgressCriteria() { return session => session.visitorName !== undefined; }

  completedFor(session) { return session.visitorsSubmitted !== undefined; }
}
