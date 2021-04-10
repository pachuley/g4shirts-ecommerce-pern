const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('ProductCategories', {

  }, {
    timestamps: false,
    tableName: 'product_categories'
    //freezeTableName: true
  });
};