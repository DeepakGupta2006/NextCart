const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

module.exports = generateToken;
