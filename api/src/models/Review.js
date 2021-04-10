const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "review",
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   autoIncrement: true,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
        allowNull: false,
      },
    },
    {
      //timestamps: true,
      //tableName: "reviews",
      //freezeTableName: true
    }
  );
};
