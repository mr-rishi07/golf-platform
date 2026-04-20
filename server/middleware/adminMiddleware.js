const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Sirf admin access kar sakta hai' });
  }
  next();
};

module.exports = adminMiddleware;