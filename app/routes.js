const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// Border response
router.post('/border-response/messages/sms-response', function(req, res) {

  var response = req.session.data['response']

  if (response == "Yes" || response == "YES" || response == "yes" || response == "y" || response == "Y") {
    res.redirect('/border-response/messages/sms--yes')
  } else if (response == "No" || response == "NO" || response == "no" || response == "n" || response == "N") {
    res.redirect('/border-response/messages/sms--no')
  } else {
    res.redirect('/border-response/messages/sms--in-country')
  }

})

router.post('/border-response/confirmation', function(req, res) {

  var compliance = req.session.data['compliance']

  if (compliance == "Yes") {
    res.redirect('/border-response/confirmation/compliant')
  } else {
    res.redirect('/border-response/confirmation/non-compliant')
  }

})

// Personal details
router.post('/personal-details/proxy/answer', function(req, res) {

  var compliance = req.session.data['proxy']

  if (compliance == "Yes") {
    res.redirect('/personal-details/contact-details/contact-preference')
  } else {
    res.redirect('/personal-details/proxy/name')
  }

})

module.exports = router
