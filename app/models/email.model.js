module.exports = (sequelize, Sequelize) => {
  const Email = sequelize.define("email", {
    email: {
      type: Sequelize.STRING,
    },
  });

  return Email;
};
