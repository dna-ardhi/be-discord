const User = require('../../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exist
    const userExists = await User.exists({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(409).send('Email already in use');
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save in database
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // create JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '24h',
      }
    );

    res.status(201).json({
      userDetails: {
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error occurred. Please try again!');
  }
};

module.exports = postRegister;
