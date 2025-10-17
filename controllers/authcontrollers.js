import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import dotenv from 'dotenv'
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'

dotenv.config()


// =================== REGISTER ===================
export const getRegister = async (req, res) => {
    res.render("auth/register", { errors: req.flash("errors"), oldinput: {} })
}

export const register = async (req, res) => {
    let errors = validationResult(req)
    const { username, email, password } = req.body


    if (!errors.isEmpty()) {
        req.flash(
            "errors",
            errors.array().map((err) => err.msg)
        );
        return res.redirect("/register");;
    }


    try {
        // cek email
        const cekEmail = await User.findOne({ where: { email } })
        if (cekEmail) 
        {
            res.status(404)
            req.flash("errors",["Email sudah digunakan silahkan login"])
            return res.redirect('/register')
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // menambahkan data baru ke databse
        const user = await User.create({
            nama: username,
            email,
            password: hashedPassword
        })

        req.flash("success", "Registrasi berhasil, silakan login!");
        res.redirect("/login");
    } catch (err) {
        req.flash("errors", [err.message]);
        res.redirect("/auth/register");
    }
}

// =================== LOGIN ===================
export const getLogin = (req, res) => {
    res.render("auth/login", { errors: req.flash("errors"), success: req.flash("success") });
};


export const login = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash(
            "errors",
            errors.array().map((err) => err.msg)
        );
        return res.redirect("/login");
    }

    const { email, password } = req.body;

    try {
        let role = "user"

        // cek apakah user sudah ada berdasarkan email
        let account = await User.findOne({ where: { email } })

        // kalau ndd cek apakah dia admin
        if (!account) {
            account = await Admin.findOne({ where: { email } })
            role = "admin"
        }

        // kalau tetap ndd return pesan error
        if (!account) {
            res.status(400)
            req.flash("errors", ["email tidak ditemukan"])
            return res.redirect("/login")
        }


        // cek kecocokan password dengan hasil hash pw
        const cekPass = await bcrypt.compare(password, account.password)
        if (!cekPass) {
            res.status(400)
            req.flash("errors", ["password salah"])
            return res.redirect("/login")
        }


        // membuat web token untuk menyimpan sesi pengguna
        const token = jwt.sign({
            id: account.id, role: account.role, username: account.nama
        },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2 // 2 jam
        })

        // setelah berhasil login masuk ke dashboard
        return res.redirect("/dashboard")

    } catch (err) {
        req.flash("errors", [err.message]);
        res.redirect("/login");
    }
}


// Logout: hapus cookie
export const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
};