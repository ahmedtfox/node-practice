const Sequelize = require("sequelize");

const db = new Sequelize("node-complete", "root", "ahmednodemysql", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = db;
