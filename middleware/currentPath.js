app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});