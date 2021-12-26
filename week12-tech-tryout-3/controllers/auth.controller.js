const db = require("../models");
const auth = require('../auth/auth.jwt')
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const cache = require('../cache')
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
    console.log({ tokenHasExpired: tokenHasExpired })

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
      console.log({ info: 'User with that refresh_token found!' })
      let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } else {
      console.log({ err: 'User not found' })
      return res.status(500).send({ err: 'User not found' });
    }

  } catch (err) {
    console.log({ err: err })
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
  // let refresh_token = generate_refresh_token(64);
  let refreshToken = uuidv4();

  // let refresh_token_maxage = new Date() + Number(config.jwtRefreshExpiration);
  let now = new Date()
  let refresh_token_maxage = now.setSeconds(now.getSeconds() + config.jwtRefreshExpiration);
  refresh_token_maxage = new Date(refresh_token_maxage);

  console.log({ refresh_token_maxage: refresh_token_maxage })

  // Generate new access token
  let accessToken = jwt.sign({ uid: user_id }, config.secret, {
    expiresIn: config.jwtExpiration
  });

  // And store the user in Redis under key 2212

  /*
  redis.set(user_id, JSON.stringify({
    refresh_token: refresh_token,
    expires: refresh_token_maxage
  }),
    redis.print
  );
  */

  cache.add(
    user_id,
    JSON.stringify(
      {
        refreshToken: refreshToken,
        expires: refresh_token_maxage.toString()
      }),
    {
      expire: config.jwtRefreshExpiration,
      type: 'json'
    },
    function (error, added) {
      if (added) {
        console.log('Added to Redis')
      }
    });

  // Set browser httpOnly cookies
  res.cookie("accessToken", accessToken, {
    // secure: true,
    // httpOnly: true
  });
  res.cookie("refreshToken", refreshToken, {
    // secure: true,
    // httpOnly: true
  });

  return res.status(200).json({
    // user,
    user_id,
    accessToken: accessToken,
    refreshToken: refreshToken
  })

}

exports.verifyToken = async (req, res) => {
  try {

    var cookieExtractor = function (req) {
      var token = null;
      if (req && req.cookies) {
        token = req.cookies['accessToken'];
      }
      console.log(token)
      return token;
    };

    const jwtCookie = cookieExtractor(req)

    console.log({jwtCookie: jwtCookie})


    if (!jwtCookie) {
      console.log({message: 'JWT token not found'})
      return res.send({ message: 'JWT token not found' })
    } 

    jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_KEY, function (err, decoded) {
      if (err) {
        console.log({ message: err.message })
        return res.json({ message: err.message })
      }

      return res.json({message: decoded})
    });


  } catch (err) {
    console.log({ err: err.message })
    res.status(400).json({err: err.message});
  }

}