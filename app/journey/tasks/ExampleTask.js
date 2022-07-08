const TaskBase = require('../taskBase');

module.exports = class ExampleTask extends TaskBase {

  // REQUIRED
  // Specify the title/link to be displayed on.
  get title() { return 'Default Title'; }

  // REQUIRED (FOR SIMPLE/SUB TASKS)
  // Specify the default URL of the first page in the task.
  // This may be overridden if the task has subtasks.
  get defaultEntryPoint() { return '/'; }

  // REQUIRED
  // Define how to check whether or not the currrent user has completed this task
  completedFor(session) { return false; }

  // OPTIONAL
  // List any other tasks upon which this task depends.
  // DEFAULT: None
  get prerequisites() { return []; }

  // OPTIONAL
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

      See PersonalDetailsTask combined with ConfirmEmail task etc. for example.
     */

    return undefined;
  }

  // OPTIONAL
  // Specify how to determine whether or not this task is relevant to the user.
  // e.g. case vs contact, NOT journeys.
  // DEFAULT: Required for all users.
  requiredFor(session) { return true; }

  // OPTIONAL
  // Define how to check whether or not the current user has started this task.
  // Must return a function.
  // DEFAULT: Mirror completedFor as not all tasks have In Progress states.
  get defaultInProgressCriteria() { return session => this.completedFor(session); }
}
