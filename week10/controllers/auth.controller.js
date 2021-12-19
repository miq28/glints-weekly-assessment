const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// ...

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    console.log(refreshToken.toJSON())

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    const tokenHasExpired = RefreshToken.verifyExpiration(refreshToken)
    console.log({tokenHasExpired: tokenHasExpired})

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    console.log(user.toJSON())

    if (user) {
      console.log({info: 'User with that refresh_token found!'})
      let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } else {
      console.log({err: 'User not found'})
      return res.status(500).send({ err: 'User not found' });
    }

  } catch (err) {
    console.log({err: err})
    return res.status(500).send({ message: err });
  }

};

exports.login = async (req, res) => {
  // When user logs in, there is no token pair in the browser
  // cookies. We need to issue both of them. Because you also
  // log user in in this step, I assume that you already have
  // their user ID.
  let user_id = 2212;

  // Generate new refresh token and it's expiration
  let refresh_token = generate_refresh_token(64);
  let refresh_token_maxage = new Date() + jwt_refresh_expiration;

  // Generate new access token
  let token = jwt.sign({ uid: user_id }, jwt_secret, {
    expiresIn: jwt_expiration
  });

  // Set browser httpOnly cookies
  res.cookie("access_token", token, {
    // secure: true,
    httpOnly: true
  });
  res.cookie("refresh_token", refresh_token, {
    // secure: true,
    httpOnly: true
  });

  // And store the user in Redis under key 2212
  redis.set(user_id, JSON.stringify({
    refresh_token: refresh_token,
    expires: refresh_token_maxage
  }),
    redis.print
  );

}