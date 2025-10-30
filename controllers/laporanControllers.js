import Laporan from "../models/reportModel.js";

// Form tambah laporan
export const tambahLaporanForm = (req, res) => {
    res.render("report", { error: null, success: null });
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

        await Laporan.create({
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
            user_id: req.session.userId,
            status: "terkirim"
        });

        res.render("report", { success: "Laporan berhasil dikirim!", error: null });
    } catch (err) {
        console.error(err);
        res.render("report", { error: "Gagal mengirim laporan!", success: null });
    }
};

// Tampilkan daftar laporan
export const daftarLaporan = async (req, res) => {
    const laporan = await Laporan.findAll({ where: { userId: req.session.userId } });
    res.render("daftar-laporan", { laporan });
};
