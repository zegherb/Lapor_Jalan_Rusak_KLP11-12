import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';
import Admin from './adminModel.js';

const Laporan = sequelize.define('Laporan', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  foto: { type: DataTypes.STRING },
  lokasi: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('terkirim', 'diverifikasi', 'diproses', 'selesai', 'ditolak'),
    defaultValue: 'terkirim'
  },
  tanggal: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Relasi sesuai class diagram
User.hasMany(Laporan, { foreignKey: 'user_id' });
Laporan.belongsTo(User, { foreignKey: 'user_id' });

Admin.hasMany(Laporan, { foreignKey: 'admin_id' });
Laporan.belongsTo(Admin, { foreignKey: 'admin_id' });

export default Laporan;
