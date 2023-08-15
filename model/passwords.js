const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const passwords=sequelize.define('password',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    isActive:Sequelize.BOOLEAN
})
module.exports=passwords;