const Sequelize = require("sequelize");

const sequelize = new Sequelize("postgres://postgres:" + process.env.DATABASE_PASSWORD + "@localhost:5432/concert-app");

module.exports = sequelize;