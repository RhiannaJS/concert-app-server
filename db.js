const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: !process.env.DATABASE_URL.includes("localhost")
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // fixing unhandled rejection
          },
        }
      : {},
  });

module.exports = sequelize;