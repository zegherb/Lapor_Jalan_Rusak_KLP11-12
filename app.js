import express from 'express'
import dotenv from 'dotenv'
import db from './models/index.js'
import authRoutes from './routes/auth.js'
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import { populateUser } from "./middlewares/authMiddleware.js";
import dashboard from './routes/dashboard.js'
import tambahLaporan from './routes/laporan.js'
import forgotPassword from './routes/reset.js'
import path from "path";

dotenv.config()


const app = express()
const PORT = process.env.PORT



// tes koneksi ke database
try {
    console.log('📡 Mengecek koneksi ke database...');
    await db.sequelize.authenticate();
    console.log('✅ Koneksi ke database berhasil!\n');
} catch (error) {
    console.error('❌ Gagal konek ke database:', error.message);
    process.exit(1);
}


app.set('view engine', 'ejs') //setup view engine menggunaka ejs
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// setup middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
})
)
app.use(populateUser)

app.use(flash())

// routes
app.use('/', dashboard)
app.use('/', authRoutes)
app.use('/dashboard', tambahLaporan)
app.use('/api/auth', authRoutes)
app.use('/auth', authRoutes)
app.use('/reset/', forgotPassword)
app.use('/api/reset', forgotPassword)

// routes ke halaman depan
app.get("/home", (req, res) => {
    res.render("index")
})

// masuk ke halaman 404
app.use("/", (req, res) => {
    res.render("404")
}
)

app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`)
})