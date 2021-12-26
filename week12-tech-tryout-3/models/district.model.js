module.exports = (sequelize, Sequelize) => {
  const District = sequelize.define("district", {
    name: {
      type: Sequelize.STRING
    },
    regency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'regency',
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

  District.associate = function(models) {
    // associations can be defined here
    District.belongsTo(models.regency, {
      foreignKey: 'regency_id'
    }),
    District.hasMany(models.office, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    })
  };

  // console.log(db)

  return District;
};