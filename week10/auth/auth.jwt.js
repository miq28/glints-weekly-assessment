const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  // console.log(req.body)
  try {
    let token = null;
    var message;
    if (req.body.token || req.query.token || req.headers["x-access-token"]) {
      // console.log('body query header')
      token = req.body.token || req.query.token || req.headers["x-access-token"]
    } else if (req.headers['authorization']) {
      // console.log('header authorization')
      token = req.headers['authorization']
        .split('; ')
        .find(row => row.startsWith('Bearer'))
      if (token) { token = token.split(' ')[1] }
    } else if (req.headers['cookie']) {
      // console.log('header cookie', req.headers['cookie'])
      token = req.headers['cookie']
        .split('; ')
        .find(row => row.startsWith('jwt='))
      if (token) { token = token.split('=')[1] }
    }



    if (!token || token === undefined || token === null) {
      message = "Unauthorized. JWT token is not found"
      console.log({ err: message })
      return res.status(403).send({ err: message });
    }
    // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, function (err, decoded) {
      if (err) {
        /*
          err = {
            name: '_______',
            message: '_______'
          }
        */
        console.log({ err: err.message })
        return res.status(401).send({ err: err.message });
      }

      req.user = decoded;
      console.log({ decoded: decoded })
      return next();
    });

  } catch (err) {
    console.error({ err: err.message })
    return res.status(401).send({ err: err.message });
  }
};

exports.GenerateToken = (payload) => {

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "30s",
    }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "24h",
    }
  );

  return {accessToken, refreshToken}

}

// module.exports = verifyToken;
