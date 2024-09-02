const Sequelize = require("sequelize");

const Sequelize = new Sequelize("node-complete", "root", "ahmednodemysql", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = Sequelize;
