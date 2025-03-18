const { DataTypes, sequelize} = require('../lib/index');
const {Supplier} = require('./Supplier.model');
const {Category} = require('./Category.model');

const Product = sequelize.define("Product",{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    quantityInStock :{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

Supplier.hasMany(Product,{foreignKey : "supplierId"});

Product.belongsToMany(Category,{through:"ProductCategory"});
Category.belongsToMany(Product,{through:"ProductCategory"});


module.exports = {Product};
