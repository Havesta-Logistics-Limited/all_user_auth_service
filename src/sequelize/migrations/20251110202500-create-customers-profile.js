"use strict";
import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("customers_profile", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: { type: Sequelize.STRING, allowNull: false },
    lastname: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    phone_number: { type: Sequelize.BIGINT, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: true },
    date_of_birth: { type: Sequelize.STRING, allowNull: true },
    gender: { type: Sequelize.STRING, allowNull: true },
    country: { type: Sequelize.STRING, allowNull: true },
    state: { type: Sequelize.STRING, allowNull: true },
    address: { type: Sequelize.STRING, allowNull: true },
    agreed_to_regular_updates: { type: Sequelize.BOOLEAN, defaultValue: false },
    accepted_privacy_policy: { type: Sequelize.BOOLEAN, defaultValue: false },
    profile_photo: { type: Sequelize.STRING, allowNull: true },
    signup_upload_temp_id: { type: Sequelize.STRING, allowNull: true },
    public_unique_Id: { type: Sequelize.STRING, allowNull: false },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("customers_profile");
}
