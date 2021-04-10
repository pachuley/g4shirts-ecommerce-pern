const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "OrderDetails",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      amount: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 999 },
        allowNull: false,
        defaultValue: 1,
      },
      size: {
        type: DataTypes.ENUM,
        values: ["XS", "S", "M", "L", "XL", "XXL"],
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "order_details",
      //freezeTableName: true
    }
  );
};
