const strUtils = require('../../lib/string-utils');

module.exports = class TaskBase {
  constructor(subtasks) {
    this.id = TaskBase.nextId();
    this.subtasks = subtasks || [];
  }

  // -- ABSTRACT METHODS ------------------------
  // The following should be overridden in concrete tasks (unless the
  // default return value is acceptable).
  // --------------------------------------------

  // Specify the title/link to be displayed on
  get title() { return 'Default Title (override me)'; }

  // Specify the default URL of the first page in the task
  // This may be overridden if the task has subtasks
  get defaultEntryPoint() { return '/'; }

  // List any other tasks upon which this task depends
  get prerequisites() { return []; }

  // Specify layout for this task's Check Your Answers page, if required.
  // If left unspecified, the task will not have a CYA page.
  // For very complex CYA screens / Confirmation flows, add them to the task's flow instead of
  // relying on the default behaviour provided by this logic.
  checkYourAnswersSummaryFor(_session) {
    /* Top level summary should be an array of objects with the following structure:
        [
          {
            heading: "Text you'd like to appear as a heading above the summary list (optional)",
            rows: [
              {
                label: "Summary row's label",
                value: "Summary row's value",
                change: "URI of the page where this row's value can be changed (optional)"
              },
              { ... } // Subsequent rows in the summary list.
            ]
          },
          { ... } // Subsequent summary lists (for complex tasks).
        ]
     */

    return undefined;
  }

  // Specify how to determine whether or not this task is relevant to the user
  // e.g. case vs contact, NOT journeys
  requiredFor(_session) { return true; }

  // Define how to check whether or not the current user has started this task.
  // Defaults to mirror completedFor as not all tasks have In Progress states.
  // Must return a function.
  get defaultInProgressCriteria() { return session => this.completedFor(session); }

  // Define how to check whether or not the currrent user has completed this task
  completedFor(_session) { return false; }

  // -- HELPERS ---------------------------------
  // The following are helpers for concrete tasks and should not be overridden.
  // --------------------------------------------

  get name() {
    return strUtils.toSkewerCase(this.constructor.name.slice(0, -4))
  }

  inProgressFor(session) {
    if (this.subtasks.length === 0) {
      const isInProgress = this.defaultInProgressCriteria;
      return isInProgress(session);
    } else {
      return this.subtasks[0].inProgressFor(session)
    }
  }

  get entryPoint() {
    return this.subtasks.length === 0 ? this.defaultEntryPoint : this.subtasks[0].entryPoint;
  }

  nextPathFor(session) {
    const checkYourAnswersPath = `/${this.name}/check-your-answers`;
    const taskHasCheckYourAnswers = sess => this.checkYourAnswersSummaryFor(sess) !== undefined;

    // Tasks without subtasks may have Check Your Answers page at the end.
    if (this.subtasks.length === 0) {
      return taskHasCheckYourAnswers(session) ? checkYourAnswersPath : '/';
    }

    const nextSubtask = this.subtasks.find(subtask => !subtask.completedFor(session));
    return nextSubtask?.entryPoint || (taskHasCheckYourAnswers(session) ? checkYourAnswersPath : '/');
  }

  // Checks whether or not the current user can start this task, based on prereqs
  canBeStartedBy(session) {
    return this.prerequisites.every(task => task.completedFor(session))
  }

  summary(session) {
    let status, href;

    switch (true) {
      case this.completedFor(session):
        status = 'completed';
        href = this.checkYourAnswersSummaryFor(session) ? `/${this.name}/check-your-answers` : `/start/${this.id}`;
        break;
      case this.inProgressFor(session):
        status = 'in_progress';
        href   = `/continue/${this.id}`;
        break;
      case this.canBeStartedBy(session):
        status = 'not_started';
        href   = `/start/${this.id}`;
        break;
      default:
        status = 'cannot_start_yet';
    }

    return { title: this.title, href, status };
  }

  // Autoincrements the tasks's ID
  static nextId() {
    this.currentId = (this.currentId || 0) + 1;
    return this.currentId;
  }
}
