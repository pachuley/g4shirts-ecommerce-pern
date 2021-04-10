const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "ProductPhotos",
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   autoIncrement: true,
      //   allowNull: false,
      //   primaryKey: true,
      // },

      // products_id: {
      //     type: DataTypes.INTEGER,
      //   },

      url: {
        type: DataTypes.STRING,
        isUrl: true,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "product_photos",
      //freezeTableName: true
    }
  );
};
