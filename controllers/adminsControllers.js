import { where } from 'sequelize';
import db from '../models/index.js'

const { Report } = db



export const getAllReports = async () => {
    try {
        const semuaLaporanUser = await Report.findAll();

        return semuaLaporanUser
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        return [];
    }

}

export const updateReportStatus = async (id, status, adminId = null) => {
    try {
        const report = await Report.findByPk(id);
        if (!report) return { ok: false, status: 404, message: 'Laporan tidak ditemukan' };

        // validasi status
        const allowed = ['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak', 'terkirim', 'diverifikasi'];
        if (!allowed.includes(status)) return { ok: false, status: 400, message: 'Status tidak valid' };

        report.status = status;
        if (adminId) report.admin_id = adminId;
        await report.save();

        return { ok: true, report };
    } catch (error) {
        console.error('Gagal update status laporan:', error);
        return { ok: false, status: 500, message: 'Server error' };
    }
}