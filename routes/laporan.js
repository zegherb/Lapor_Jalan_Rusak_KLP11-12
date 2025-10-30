import express from 'express'
import { tambahLaporanForm, tambahLaporan, daftarLaporan } from '../controllers/laporanControllers.js'
import multer from 'multer'

const router = express.Router()

// konfigurasi multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    limits: { files: 3 } 
});


// halaman buat laporan baru
router.get("/reports",tambahLaporanForm)

// post 
router.post("/api/reports/add",upload.array("foto",3),tambahLaporan)


export default router