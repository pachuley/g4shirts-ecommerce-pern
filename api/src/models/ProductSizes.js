const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo  
  sequelize.define('ProductSizes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },          
    size: {
        type: DataTypes.ENUM,
        values: ['XS','S','M','L','XL','XXL'],
        allowNull: false,
        //defaultValue: 'XS'
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,      
        allowNull: false,
        defaultValue: 0
      },
  }, {
    timestamps: false,
    tableName: 'product_sizes',
    indexes: [
      {
          unique: true,
          fields: ['size', 'productId']
      }
    ]    
    
    //freezeTableName: true
  });
};