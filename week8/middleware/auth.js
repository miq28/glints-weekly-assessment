const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  // console.log(req.headers)

  try {
    let token = null;
    if (req.body.token || req.query.token || req.headers["x-access-token"]) {
      token = req.body.token || req.query.token || req.headers["x-access-token"]
    } else if (req.headers['authorization']) {
      token = req.headers['authorization']
        .split('; ')
        .find(row => row.startsWith('Bearer'))
        .split(' ')[1]
    } else if (req.headers['cookie']) {
      token = req.headers['cookie']
        .split('; ')
        .find(row => row.startsWith('jwt='))
        .split('=')[1]
    }
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    console.log(req.user)
    return next();
  } catch (err) {
    console.error({err: err.message})
    return res.status(401).send({err: err.message});
  }


};

module.exports = verifyToken;
