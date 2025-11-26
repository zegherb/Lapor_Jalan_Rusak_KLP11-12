'use strict';
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    alamat_lengkap: {
      type: Sequelize.STRING
    },
    latitude: {
      type: Sequelize.DECIMAL
    },
    longitude: {
      type: Sequelize.DECIMAL
    },
    nama_pelapor: {
      type: Sequelize.STRING
    },
    tingkat_kerusakan: {
      type: Sequelize.ENUM('ringan', 'sedang', 'berat'),
      allowNull: false
    },
    dampak_kerusakan: {
      type: Sequelize.TEXT
    },
    catatan_tambahan: {
      type: Sequelize.TEXT
    },
    foto_1: {
      type: Sequelize.STRING
    },
    foto_2: {
      type: Sequelize.STRING
    },
    foto_3: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('terkirim', 'diverifikasi', 'diproses', 'selesai', 'ditolak'),
      defaultValue: 'terkirim'
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    admin_id: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Reports');
}
