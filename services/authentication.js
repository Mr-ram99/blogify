const jwt = require('jsonwebtoken');
const secret = '@#$%^$%^&$%^&(*&^%';

const createToken = async (user) =>{
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageURL: user.profileImageURL
  }
  const token = await jwt.sign(payload, secret, {
    expiresIn:'24h'
  });

  return token;
}

const validateToken = (token) =>{
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  createToken,
  validateToken
}