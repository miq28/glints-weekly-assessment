// controllers/index.js

exports.protected = async (req, res) => {
    if (req.user.provider === 'google') {
        return res.send(`Hello ${req.user.displayName}, you are now authenticated and can access /protected route.`)
    }
    res.send(`Hello ${req.user.first_name} ${req.user.last_name}, you are now authenticated and can access /protected route.`)
  };