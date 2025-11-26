'use strict';
import {Model} from "sequelize"

export default (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.belongsTo(models.Admin, { foreignKey: 'admin_id' });
    }
  }
  Report.init({
    alamat_lengkap: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    nama_pelapor: DataTypes.STRING,
    tingkat_kerusakan: {
      type: DataTypes.ENUM('ringan', 'sedang', 'berat'),
      allowNull: false
    },
    dampak_kerusakan: DataTypes.TEXT,
    catatan_tambahan: DataTypes.TEXT,
    foto_1: DataTypes.STRING,
    foto_2: DataTypes.STRING,
    foto_3: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('terkirim', 'diverifikasi', 'diproses', 'selesai', 'ditolak'),
      defaultValue: 'terkirim'
    },
    user_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};