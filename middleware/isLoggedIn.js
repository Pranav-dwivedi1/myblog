module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).send('Unauthorized: Please log in.');
}; 