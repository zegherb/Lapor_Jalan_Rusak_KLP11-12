// routes/dashboard.js
import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import Laporan from "../models/reportModel.js"; // contoh model

const router = express.Router();

// halaman user dashboard (harus login)
router.get("/dashboard", requireAuth, async (req, res) => {
    if(req.user.role === "admin"){
        res.redirect("/admin")
        return
    }

    // req.user tersedia karena requireAuth mem-verify token
    const userId = req.user.id;

    // ambil laporan milik user — contoh sederhana
    const reports = await Laporan.findAll({ where: { user_id: userId } });

    res.render("dashboard", { reports });
});



// halaman admin dashboard (harus login & role admin)
router.get("/admin", requireAuth, requireAdmin, async (req, res) => {
    // admin halaman, tampilkan semua laporan
    const allReports = await Laporan.findAll({ include: ["User", "Admin"] });
    res.render("admin", { reports: allReports });
});

export default router;
