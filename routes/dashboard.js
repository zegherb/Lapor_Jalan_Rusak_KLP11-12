// routes/dashboard.js
import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { getUserReports,getUserAllReports,getUserProcessReports,getUserDoneReports } from "../controllers/userController.js";
import { getAllReports } from "../controllers/adminsControllers.js";
import { updateReportStatus } from "../controllers/adminsControllers.js";
import db from '../models/index.js'
import user from "../models/user.js";
const { Report } = db

const router = express.Router();

// halaman user dashboard (harus login)
router.get("/dashboard", requireAuth, async (req, res) => {
    if (req.user.role === "admin") {
        res.redirect("/admin")
        return
    }

    // req.user tersedia karena requireAuth mem-verify token
    const userId = req.user.id;
    
    const laporanTerbaru = await getUserReports(userId)
    const semuaLaporan  = await getUserAllReports(userId)
    const laporanDiproses = await getUserProcessReports(userId)
    const laporanSelesai = await getUserDoneReports(userId)
    
    res.render("dashboard", {
        user: req.user,
        laporanTerbaru,
        semuaLaporan,
        laporanDiproses,
        laporanSelesai
    });
});



// halaman admin dashboard (harus login & role admin)
router.get("/admin", requireAuth, requireAdmin, async (req, res) => {
    // admin halaman, tampilkan semua laporan
    const userId = req.user.id;

    const semuaLaporan  = await getAllReports()
    res.render("admin",{semuaLaporan});
});

// API: update status laporan (admin only)
router.patch('/api/laporan/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body || {};
        const adminId = req.user && req.user.id ? req.user.id : null;

        const result = await updateReportStatus(id, status, adminId);
        if (!result.ok) return res.status(result.status || 400).json({ message: result.message });

        return res.json({ message: 'Status diperbarui', report: result.report });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;
