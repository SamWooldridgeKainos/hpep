const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const strUtils = require('../../lib/string-utils');
const tasks = require('./tasks');
const Section = require('./Section')

// Proxy Task class -
// Takes a task type and instantiates the appropriate concrete class.
class Task {
  constructor(taskName, opts) {
    const className = `${strUtils.toPascalCase(taskName)}Task`;
    const taskImplementation = tasks[className];
    if (!taskImplementation) {
      throw `${className} is not an available task. Please check the journeys.yml file.`;
    }
    return new taskImplementation(opts);
  }
}

module.exports = class JourneyManager {
  #journeyConfig;
  #journeyIndex;

  constructor() {
    this.#journeyConfig = yaml.load(fs.readFileSync(path.join(__dirname, '../../journeys.yml')));
    this.availableJourneys = Object.keys(this.#journeyConfig.journeys);
    this.currentJourney = this.#journeyConfig.default_journey;
    this.#loadJourney();
  }

  switchJourney(selectedJourney) {
    if (!this.availableJourneys.includes(selectedJourney)) {
      throw 'Invalid journey selected';
    }

    this.currentJourney = selectedJourney;
    this.#loadJourney();
  }

  startTask(taskId) { return this.#task(taskId).entryPoint; }

  continueTask(taskId, session) { return this.#task(taskId).nextPathFor(session); }

  // Called from WITHIN a particular task
  // Therefore not responsible for inter-task or inter-section navigation.
  nextPath(session) {
    const currentTaskId = session.currentTask;
    const currentTask = this.#task(currentTaskId);

    return currentTask.nextPathFor(session);
  }

  // Retrieve necessary details to construct the Check Your Answers page
  checkAnswers(session) {
    const currentTask = this.#task(session.currentTask);
    return currentTask.checkYourAnswersSummaryFor(session);
  }

  // Load the selected journey.
  #loadJourney() {
    const journeyDefinition = this.#journeyConfig.journeys[this.currentJourney];
    const allTasks = [];
    const sections = Object.keys(journeyDefinition).map(section => {
      const sectionName = strUtils.toSentenceCase(section);
      const taskDefinitions = journeyDefinition[section];

      const tasks = taskDefinitions.map(taskDefinition => {
        var taskName, subtasks;
        if (typeof taskDefinition === 'string') {
          taskName = taskDefinition;
          subtasks = [];
        } else {
          var [taskName, subtaskNames] = Object.entries(taskDefinition)[0];
          subtasks = subtaskNames.map(subtaskName => {
            return new Task(subtaskName, []);
          });
        }
        return new Task(taskName, subtasks);
      })

      allTasks.push(...tasks);
      return new Section(sectionName, tasks);
    });

    const confirmationSection = new Section(
      'Finish',
      [new tasks.ConfirmAndSubmitTask(allTasks)]
    );

    sections.push(confirmationSection);
    this.journey = sections;
    this.#indexJourney();
  }

  // Index the journey's tasks to speed up task retrieval from inside sections.
  #indexJourney() {
    this.#journeyIndex = {}
    this.journey.forEach((section, sectionId) => {
      Object.keys(section.taskIndex).forEach(taskId => { this.#journeyIndex[taskId] = sectionId; })
    })
  }

  #section(taskId) {
    return this.journey[this.#journeyIndex[taskId]];
  }

  #task(taskId) {
    return this.#section(taskId).getTask(taskId);
  }
}
