require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
} = process.env;

const DATABASE_URL = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}`;

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  native: false,
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    // descomentar en heroku
    /*  ssl: {
      require: true,
      rejectUnauthorized: false,
    }, */
  },
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Category,
  Product,
  ProductPhotos,
  ProductSizes,
  Order,
  OrderDetails,
  Role,
  User,
  Review,
} = sequelize.models;

Category.belongsToMany(Product, {
  through: "ProductCategories",
});
Product.belongsToMany(Category, {
  through: "ProductCategories",
});
Product.hasMany(ProductSizes, {
  foreingKey: "products_id",
  sourceKey: "id",
});
ProductSizes.belongsTo(Product, {
  foreingKey: "products_id",
  sourceKey: "id",
});
Product.hasMany(ProductPhotos, {
  foreingKey: "products_id",
  sourceKey: "id",
});
ProductPhotos.belongsTo(Product, {
  foreingKey: "products_id",
  sourceKey: "id",
});

Role.hasMany(User, { foreingKey: "roles_id", sourceKey: "id" });
User.belongsTo(Role, { foreingKey: "roles_id", sourceKey: "id" });

User.hasMany(Order, { foreingKey: "users_id", sourceKey: "id" });
Order.belongsTo(User, { foreingKey: "users_id", sourceKey: "id" });

Order.hasMany(OrderDetails, { foreingKey: "orders_id", sourceKey: "id" });
OrderDetails.belongsTo(Order, { foreingKey: "orders_id", sourceKey: "id" });

Product.hasMany(OrderDetails, { foreingKey: "products_id", sourceKey: "id" });
OrderDetails.belongsTo(Product, { foreingKey: "products_id", sourceKey: "id" });

User.hasMany(Review, { foreingKey: "users_id", sourceKey: "id" });
Review.belongsTo(User, { foreingKey: "users_id", sourceKey: "id" });

User.belongsToMany(Product, {
  through: "review",
});
Category.belongsToMany(Product, {
  through: "ProductCategories",
});
Product.belongsToMany(Category, {
  through: "ProductCategories",
});
Product.belongsToMany(User, {
  through: "review",
});
Product.hasMany(Review);
User.belongsToMany(Product, {
  through: "WishlistProducts",
});
Product.belongsToMany(User, {
  through: "WishlistProducts",
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
