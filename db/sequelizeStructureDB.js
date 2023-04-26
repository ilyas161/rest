const sequelize = require("./sequelizeConnect");
const { DataTypes, Model } = require("sequelize");

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.TEXT,
      unique: true,
    },
    firstname: {
      type: DataTypes.TEXT,
    },
    lastname: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
    },
    salt: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: false,
  }
);

module.exports = User;
