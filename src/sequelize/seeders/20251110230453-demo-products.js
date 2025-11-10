"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
