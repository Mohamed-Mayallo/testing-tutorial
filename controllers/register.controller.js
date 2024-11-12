const validator = require('validator');
const { User } = require('../models/user');

const registerController = async (input) => {
  validateInput(input);

  await emailShouldNotBeDuplicated(input.email);

  const user = await createUser(input);
  return user;
};

const validateInput = (input) => {
  if (!input) throw new Error('Invalid input');

  const { name, email, password } = input;

  const isValidName = !!name && validator.isLength(name, { max: 10, min: 1 });
  if (!isValidName) throw new Error('Invalid name');

  const isValidEmail = !!email && validator.isEmail(email);
  if (!isValidEmail) throw new Error('Invalid email');

  const isValidPassword = !!password && validator.isLength(password, { max: 50, min: 8 });
  if (!isValidPassword) throw new Error('Invalid password');
};

const emailShouldNotBeDuplicated = async (email) => {
  const anotherUser = await User.findOne({ email });
  if (anotherUser) throw new Error('Duplicated email');
};

const createUser = async (input) => {
  const { name, email, password } = input;

  // For sure, don't save the password like this
  const user = new User({ name, email, password });
  return await user.save();
};

module.exports = {
  registerController
};
