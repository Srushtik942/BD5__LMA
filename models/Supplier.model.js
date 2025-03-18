const {DataTypes, sequelize} = require('../lib/index');

const Supplier = sequelize.define("Supplier",{
    name : {
        type: DataTypes.STRING,
        allowNull : false,
    },
    contact:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email : {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,

    },
    phone :{
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = {Supplier};