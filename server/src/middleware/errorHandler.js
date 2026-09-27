const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  const response = {
    success: false,
    message: err.message || "Something went wrong on the server",
  };
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
