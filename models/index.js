require("dotenv").config();
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const Sequelize = require("sequelize");
let sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.ipfsLog = require("../models/ipfsLog.model.js")(sequelize, Sequelize);

db.ipfsLog.belongsToMany(db.user, {
  through: "user_ipfs_logs",
});

module.exports = db;
