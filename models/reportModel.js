import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';
import Admin from './adminModel.js';

const Laporan = sequelize.define('Report', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  alamat_lengkap: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  nama_pelapor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tingkat_kerusakan: {
    type: DataTypes.ENUM('ringan', 'sedang', 'berat'),
    allowNull: false
  },
  dampak_kerusakan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  catatan_tambahan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  foto_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  foto_2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  foto_3: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  status: {
    type: DataTypes.ENUM('terkirim', 'diverifikasi', 'diproses', 'selesai', 'ditolak'),
    defaultValue: 'terkirim'
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
});

// Relasi sesuai class diagram
User.hasMany(Laporan, { foreignKey: 'user_id' });
Laporan.belongsTo(User, { foreignKey: 'user_id' });

Admin.hasMany(Laporan, { foreignKey: 'admin_id' });
Laporan.belongsTo(Admin, { foreignKey: 'admin_id' });

export default Laporan;
