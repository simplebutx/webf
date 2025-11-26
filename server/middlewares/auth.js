function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ msg: '로그인 필요함' });
}

module.exports = { isLoggedIn };