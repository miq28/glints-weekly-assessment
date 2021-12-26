module.exports = (sequelize, Sequelize) => {
    const Regency = sequelize.define("regency", {
      name: {
        type: Sequelize.STRING
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'province',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    }, {});

    Regency.associate = function(models) {
      // associations can be defined here
      Regency.belongsTo(models.province, {
        foreignKey: 'province_id'
      }),
      Regency.hasMany(models.district, {
        foreignKey: 'regency_id',
        onDelete: 'CASCADE'
      })
    };

    // console.log(db)

    return Regency;
  };


// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Regency extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       Regency.hasMany(models.District, {
//         foreignKey: 'regency_id',
//       })
//     }
//   };
//   Regency.init({
//     name: DataTypes.STRING,
//     province_id: DataTypes.INTEGER,
//     created_at: DataTypes.DATE,
//     updated_at: DataTypes.DATE
//     // email: DataTypes.STRING,
//     // password: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'regencies',
//   });
//   return Regency;
// };