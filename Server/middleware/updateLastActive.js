module.exports = async function updateLastActive(req, res, next) {
  if (req.user) {
    req.user.lastActiveAt = new Date();
    await req.user.save();
  }
  next();
};