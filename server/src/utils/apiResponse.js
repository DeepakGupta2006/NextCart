class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const success = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({ success: true, message, data });
};

module.exports = { ApiError, success };
