const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.post('/iac1/compliance/confirmation', function(req, res) {

  var compliance = req.session.data['compliance1']

  if (compliance == "Yes") {
    res.redirect('/iac1/compliance/confirmation--compliant')
  } else {
    res.redirect('/iac1/compliance/confirmation--non-compliant')
  }

})

module.exports = router
