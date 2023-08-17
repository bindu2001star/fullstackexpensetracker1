const {Sequelize,DataTypes}=require('sequelize');
const sequelize=require('../util/database');
const DownloadReport=sequelize.define('download',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey : true,
        autoIncrement:true
    },
    URL:Sequelize.STRING,
    downloadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
})
module.exports=DownloadReport;