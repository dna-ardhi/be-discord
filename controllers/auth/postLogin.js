const User = require('../../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // send new token
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
      const response = {
        userDetails: {
          email: user.email,
          username: user.username,
          token,
          _id: user._id,
        },
      };
      return res.status(200).json(response);
    }

    return res.status(400).send('Invalid credential. Please try again');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong. Please try again');
  }
};

module.exports = postLogin;
