import db from '../models/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const { Report } = db

// Helper: extract user ID dari JWT token di cookie
const getUserIdFromToken = (req) => {
    try {
        const token = req.cookies?.token;
        if (!token) return null;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (err) {
        return null;
    }
};

// Form tambah laporan
export const tambahLaporanForm = (req, res) => {
    res.render("report", { error: req.flash("error"), success: req.flash("success") });
};

// Simpan laporan ke database
export const tambahLaporan = async (req, res) => {
    try {
        const { alamat, latitude, longitude, namaPelapor, dampak, tingkat, catatan } = req.body;
        

        // handle cases where multer provides req.files (array), req.file (single), or no files
        const files = req.files || (req.file ? [req.file] : []);
        const foto = Array.isArray(files) ? files.map(file => file.filename) : [];

        // normalize tingkat to match enum values in the model
        const tingkatNormalized = tingkat ? String(tingkat).toLowerCase() : null;

        // Extract user ID dari JWT token
        const userId = getUserIdFromToken(req);
        if (!userId) {
            req.flash("error", "Silakan login terlebih dahulu");
            return res.redirect("/login");
        }


        await Report.create({
            alamat_lengkap: alamat,
            latitude,
            longitude,
            nama_pelapor: namaPelapor,
            tingkat_kerusakan: tingkatNormalized,
            dampak_kerusakan: dampak,
            catatan_tambahan: catatan || null,
            foto_1: foto[0] || null,
            foto_2: foto[1] || null,
            foto_3: foto[2] || null,
            user_id: userId,
            status: "terkirim"
        });

        req.flash("success", "Berhasil mengirim laporan");
        res.redirect("/dashboard/reports")
    } catch (err) {
        console.error(err);
        req.flash("error", "Gagal mengirim laporan");
        res.redirect("/dashboard/reports")
    }
};

// Tampilkan daftar laporan
export const daftarLaporan = async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        req.flash("error", "Silakan login terlebih dahulu");
        return res.redirect("/login");
    }
    
    const laporan = await Report.findAll({ where: { user_id: userId } });
    res.render("daftar-laporan", { laporan });
};
