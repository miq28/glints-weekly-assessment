module.exports = (sequelize, Sequelize) => {
    const Office = sequelize.define("office", {
      district_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'district',
          key: 'id'
        }
      },
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

    Office.associate = function(models) {
      // associations can be defined here
      Office.belongsTo(models.district, {
        foreignKey: 'district_id'
      })
    };
  
    return Office;
  };