const express = require('express');
const router  = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/inside/:username", (req, res, next) => {
  let username = req.params.username;
  res.render("inside", { username });
});

module.exports = router;
