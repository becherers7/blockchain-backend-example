const db = require("../models");
const User = db.user;

const findAllUsers = (req, res) => {
  User.findAll()
    .then((users) => {
      const formatUsers = users.map((u) => {
        return {
          email: u.email,
          username: u.username,
        };
      });
      res.status(200).send(formatUsers);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  findAllUsers,
};
