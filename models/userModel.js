import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  resetToken: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpires: { type: DataTypes.DATE, allowNull: true }
}, {
  timestamps: true,
  underscored: true
});

export default User;
