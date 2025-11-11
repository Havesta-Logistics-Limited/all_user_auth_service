/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("products", [
      {
        name: "Apple",
        price: 2.5,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Banana",
        price: 1.2,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Orange",
        price: 3.0,
        stock: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
