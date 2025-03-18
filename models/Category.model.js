const {DataTypes, sequelize} = require('../lib/index');

const Category = sequelize.define("Category",{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    }
}
);

module.exports = {Category};