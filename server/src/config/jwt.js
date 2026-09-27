module.exports = {
  secret: process.env.JWT_SECRET || "dev_secret_change_me",
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
