var passport = require('passport');

module.exports = {
  new: function(req, res) { 
    res.view('session/new',{ layout: 'session_layout' });
  },
  destroy: function(req, res) {
    req.logout();
    res.redirect('/entrar');
  },
  auth: passport.authenticate('local',{
    successRedirect: '/order/'
    ,failureRedirect: '/entrar'
    ,failureFlash: true
  })
};