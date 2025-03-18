const {DataTypes,sequelize} = require('../lib/index');

const ProductCategory = sequelize.define("ProductCategory",{


},
{
timestamps: false
});

module.exports = {ProductCategory};