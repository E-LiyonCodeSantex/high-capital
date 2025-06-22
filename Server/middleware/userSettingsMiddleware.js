
function requireSettingsConfirmation(req, res, next) {
  if (req.session.settingsConfirmed) return next();
  res.redirect('/user/settings/confirm');
}

function setUserLocals(req, res, next) {
    res.locals.user = req.user;
    next();
}

module.exports = { requireSettingsConfirmation, setUserLocals, };