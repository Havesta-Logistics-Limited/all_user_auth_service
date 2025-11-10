export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employees_profile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstname: { type: Sequelize.STRING },
      lastname: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      phone_number: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      department: { type: Sequelize.STRING },
      role: { type: Sequelize.STRING },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      hire_date: { type: Sequelize.DATE },
      profile_photo: { type: Sequelize.STRING },
      employee_code: { type: Sequelize.STRING },
      public_unique_Id: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employees_profile");
  },
};
