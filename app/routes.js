const express = require('express');
const strUtils = require('../lib/string-utils');

const router = express.Router();

// -- Authentication ----------------------------

router.post('/sign-in', (req, res) => {
  req.session.data.userType = 'citizen';
  res.redirect('/');
})

router.post('/staff/sign-in', (req, res) => {
  req.session.data.userType = 'staff';
  res.redirect('/');
})

router.get('/sign-out', (req, res) => {
  req.session.data = {};
  res.redirect('/sign-in');
})

// -- Citizen -----------------------------------

router.get('/', (req, res) => {
  const sessionData = req.session.data;

  if (sessionData.userType === 'staff') {
    return res.redirect('/management');
  } else if (sessionData.userType !== 'citizen') {
    return res.redirect('/sign-in');
  }

  const journeyManager = req.app.locals.journeyManager;
  const journeySummary = journeyManager.journey.map(section => section.summary(sessionData));
  const totalSectionCount = journeySummary.length - 1;
  const completedSectionCount = Math.min(journeySummary.filter(section => section.completed).length, totalSectionCount);

  res.render('task-list', {
    sections: journeySummary,
    completedSectionCount,
    totalSectionCount
  })
})

router.get('/start/:taskId', (req, res) => {
  const sessionData = req.session.data;
  if (!sessionData.userType) return res.redirect('/');

  const taskId = req.params.taskId;
  req.session.data.currentTask = taskId;
  const journeyManager = req.app.locals.journeyManager;
  res.redirect(journeyManager.startTask(taskId));
})

router.get('/continue/:taskId', (req, res) => {
  const sessionData = req.session.data;
  if (!sessionData.userType) return res.redirect('/');

  const taskId = req.params.taskId;
  req.session.data.currentTask = taskId;
  const journeyManager = req.app.locals.journeyManager;
  res.redirect(journeyManager.continueTask(taskId, sessionData));
})

router.get('/continue', (req, res) => {
  const sessionData = req.session.data;
  if (!sessionData.userType) return res.redirect('/');

  const journeyManager = req.app.locals.journeyManager;
  res.redirect(journeyManager.nextPath(sessionData));
})

router.get('/:taskName/check-your-answers', (req, res) => {
  const sessionData = req.session.data;
  if (!sessionData.userType) return res.redirect('/');

  const journeyManager = req.app.locals.journeyManager;
  const summaries = journeyManager.checkAnswers(sessionData);
  const taskName = req.params.taskName;

  if (!summaries) res.redirect('/');

  res.render('check-your-answers', { summaries, taskName });
});

router.get('/confirm', (req, res) => {
  const sessionData = req.session.data;
  if (!sessionData.userType) return res.redirect('/');

  sessionData.formsCompleted = true;
  res.render('confirm');
})

// -- Staff -------------------------------------
// No routes yet. Add here when required.

// -- Admin -------------------------------------
router.get('/switch-journey', (req, res) => {
  const journeyManager = req.app.locals.journeyManager;
  const journeys = journeyManager.availableJourneys.map(journey => {
    return {
      value: journey,
      text: strUtils.toSentenceCase(journey)
    }
  });

  res.render('switch-journey', { journeys });
})

router.post('/switch-journey', (req, res) => {
  // Reload journey based on selected journey
  const journeyManager = req.app.locals.journeyManager;
  journeyManager.switchJourney(req.body.journey);

  // Wipe session and redirect to home.
  req.session.data = {};
  res.redirect('/sign-in')
})

module.exports = router;
