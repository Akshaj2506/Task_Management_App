const User = require("../models/User");

const fetchUser = (req, res, next) => {
   try {
      const name = req.body.name;
      if (!name) {
         res.status(500).json({ error: "Kindly use an authentic name" })
      }
      const data = User.findOne({name : name});
      req.name = data.name;
      next();
   } catch (error) {
      console.error(error.message);
      res.status(401).json({ error: "Internal Server Error" });
   }
}

module.exports = fetchUser;