import { where } from 'sequelize';
import db from '../models/index.js'

const { Report } = db

export const getUserReports = async (userId) => {
    try {
        const laporanTerbaru = await Report.findAll({
            where: { user_id: userId },
            attributes: ["id", "alamat_lengkap", "status", "createdAt"],
            order: [["createdAt", "DESC"]],
            limit: 5,
        });

        return laporanTerbaru;
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        return [];
    }
};

export const getUserAllReports = async (userId) => {
    try {
        const semuaLaporanUser = await Report.findAll({
            where: { user_id: userId }
        });

        return semuaLaporanUser
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        return [];
    }

}

export const getUserProcessReports = async (userId) => {
    try {
        const semuaLaporanUser = await Report.findAll({
            where: {
                user_id: userId,
                status: "diproses"
            }
        });

        return semuaLaporanUser
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        return [];
    }

}

export const getUserDoneReports = async (userId) => {
    try {
        const semuaLaporanUser = await Report.findAll({
            where: {
                user_id: userId,
                status: "selesai"
            }
        });

        return semuaLaporanUser
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        return [];
    }

}