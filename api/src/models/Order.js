const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      // users_id: {
      //   type: DataTypes.INTEGER,
      // },
      state: {
        type: DataTypes.ENUM,
        values: ["Active", "Pending", "Complete", "Canceled"],
        defaultValue: "Active",
        allowNull: false,
      },
    },
    {
      timestamps: true,
      //tableName: 'orders'
      //freezeTableName: true
    }
  );
};
