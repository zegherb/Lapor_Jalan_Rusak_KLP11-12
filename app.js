import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db.js'
import authRoutes from './routes/auth.js'
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import { populateUser } from "./middlewares/authMiddleware.js";
import dashboard from './routes/dashboard.js'
import forgotPassword from './routes/reset.js'

dotenv.config()


const app = express()
const PORT = process.env.PORT


// TES koneksi ke database
sequelize.authenticate()
    .then(() => console.log('✅ Database terkoneksi!'))
    .catch(err => console.error('❌ Gagal konek DB:', err));

sequelize.sync()
    .then(() => console.log('✅ Struktur tabel sinkron dengan class diagram!'))


app.set('view engine', 'ejs') //setup view engine menggunaka ejs
app.use(express.static('public'))


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
app.use('/',dashboard)
app.use('/', authRoutes)
app.use('/api/auth', authRoutes)
app.use('/auth',authRoutes)
app.use('/reset/',forgotPassword)
app.use('/api/reset',forgotPassword)

// routes ke halaman depan
app.get("/home", (req, res) => {
    res.render("index")
})

// masuk ke halaman 404
app.use("/",(req, res) => {
    res.render("404")}
)

app.listen(PORT, () => {
    console.log(`app listening at http//:localhost:${PORT}`)
})