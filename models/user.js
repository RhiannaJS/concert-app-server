const{DataTypes} = require("sequelize");
const db = require("../db");

const User = db.define("user", {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    username:{
        require: true,
        type: DataTypes.STRING(75),
        allowNull: false, 
        unique: true,
    },
    email: {
        require: true,
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        require: true,
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = User;