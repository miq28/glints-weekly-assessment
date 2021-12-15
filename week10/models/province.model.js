module.exports = (sequelize, Sequelize) => {
    const Province = sequelize.define("province", {
      name: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    }, {});

    Province.associate = function(models) {
      // associations can be defined here
      Province.hasMany(models.regency, {
        foreignKey: 'province_id',
        onDelete: 'CASCADE'
      })
    };

    // console.log(models)
  
    return Province;
  };