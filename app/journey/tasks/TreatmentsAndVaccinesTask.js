const TaskBase = require('../taskBase');

module.exports = class TreatmentsAndVaccinesTask extends TaskBase {
  get title() { return 'Treatments and vaccines'; }

  inProgressFor(session) { return session.vaccineDoses !== undefined; }

  completedFor(session) { return session.vaccineDetailsCompleted !== undefined; }
}
