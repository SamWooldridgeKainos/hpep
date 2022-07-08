const TaskBase = require('../taskBase');

module.exports = class EqualityInformation extends TaskBase {

  // REQUIRED
  // Specify the title/link to be displayed on.
  get title() { return 'Do you want to answer the equality questions?'; }

  // REQUIRED (FOR SIMPLE/SUB TASKS)
  // Specify the default URL of the first page in the task.
  // This may be overridden if the task has subtasks.
  get defaultEntryPoint() { return '/equality-information/equality-questions'; }

  // REQUIRED
  // Define how to check whether or not the currrent user has completed this task
  completedFor(session) { return false; }

  // OPTIONAL
  // List any other tasks upon which this task depends.
  // DEFAULT: None
  get prerequisites() { return [ new PersonalDetailsTask() ]; }

  // OPTIONAL
  // Specify layout for this task's Check Your Answers page, if required.
  // If left unspecified, the task will not have a CYA page.
  // For very complex CYA screens / Confirmation flows, add them to the task's flow instead of
  // relying on the default behaviour provided by this logic.
  checkYourAnswersSummaryFor(_session) {
    // Top level summary should be an array of objects with the following structure:
        [
          {
            heading: "Text you'd like to appear as a heading above the summary list (optional)",
            rows: [
              {
                label: "Answer equality questions?",
                value: session.equalityQuestions,
                change: this.defaultEntryPoint
              }
            ]
          }
        ]

      // See PersonalDetailsTask combined with ConfirmEmail task etc. for example.


    return undefined;
  }
}
