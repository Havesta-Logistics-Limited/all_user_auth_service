import bcrypt from "bcryptjs";

export default {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("admin@123", 10);
    await queryInterface.bulkInsert("admins", [
      {
        name: "Super Admin",
        email: "admin@admin.com",
        password: passwordHash,
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("admins", null, {});
  },
};
