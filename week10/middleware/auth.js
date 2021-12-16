const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  // console.log(req.headers)

  try {
    let token = null;
    if (req.body.token || req.query.token || req.headers["x-access-token"]) {
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

    if (!token || token === undefined) {
      return res.status(403).send("Unauthorized. JWT token is not found");
    }
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    console.log(req.user)
    return next();
  } catch (err) {
    console.error({ err: err.message })
    return res.status(401).send({ err: err.message });
  }


};

module.exports = verifyToken;
