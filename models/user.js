const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const { createToken } = require('../services/authentication');

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: "/images/default.jpg"
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
  const user = await this.findOne({ email: email });
  if (!user) throw new Error('user not found!');

  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');
  if (hashedPassword !== userProvidedHash) throw new Error('wrong password!');
  const token = createToken(user);
  return token;
})

const User = new model('user', userSchema);

module.exports = User;