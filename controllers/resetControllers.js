import { Result, validationResult } from "express-validator"
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import { sendEmail } from '../Utils/sendMails.js'
import { console } from "inspector"



// ====== forgot password =====
// get forgot 

export const getForgotPassword = async (req, res) => {
    res.render('auth/forgot_password', { errors: req.flash("errors"), success: req.flash("success") })
}

// post forgot password
export const ForgotPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash(
            "errors",
            errors.array().map((errs) => errs.msg)
        )
        res.redirect("/reset/forgot-password")
    }

    try {
        const { email } = req.body
        const user = await User.findOne({ where: { email } })

        // cek dulu email ini ada di data base atau tidak
        if (!user) {
            req.flash("errors", ["Email Tidak ditemukan"])
            return res.redirect("/reset/forgot-password")
        }

        // buat token unik untuk link dan waktu kadaluarsa nya
        const token = crypto.randomBytes(32).toString("hex")
        const expireAt = new Date(Date.now() + 15 * 60 * 1000)

        user.resetToken = token
        user.resetTokenExpires = expireAt
        await user.save()

        const resetUrl = `${process.env.BASE_URL}/reset/reset-password?token=${token}`

        // isi untuk html didalam email yang akan dikirim
        const html = `
      <h2>Reset Password</h2>
      <p>Hai ${user.nama},</p>
      <p>Klik link berikut untuk mengganti password kamu (berlaku 5 menit):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <br><br>
      <small>Jika kamu tidak meminta reset password, abaikan email ini.</small>`


        // kemudian kita kirim email
        const isEmailSend = await sendEmail(email, "Reset Password Lajarus App", html)
        if (isEmailSend) {
            req.flash("success", ["Link reset password sudah di kirim ke email kamu!"])
        } else {
            req.flash("errors", ["Gagal mengirim email. Coba lagi nanti"])
        }

        res.redirect("/reset/forgot-password")

    } catch (error) {
        console.log(error.message)
        req.flash("errors", "Gagal mengirim email. Coba lagi nanti");
        res.redirect("/reset/forgot-password");
    }
}

// ======= reset password ====

export const getResetPassword = async (req, res) => {
    // validasi dulu sebelum render halaman
    // read token from query string correctly
    const token = req.query.token
    try {
        // cek kalau tokennya ada apa tidak
        if (!token) {
            res.render("404")
            return
        }

        // kalau ada token kita cari user berdasarkan token itu
        const user = await User.findOne({ where: { resetToken: token } })
        console.log(user)
        if (!user) {
            req.flash("errors", ["token tidak valid!"])
            res.redirect("/reset/forgot-password")
            return
        }

        // cek token kadaluarsa apa nda
        if (user.resetTokenExpires < new Date()) {
            req.flash("errors", ["token sudah kadaluarsa"])
            res.redirect("/reset/forgot-password")
            return
        }

        // kalau valid baru bisa buka halaamn
        res.render('auth/reset_password', { errors: req.flash("errors"), success: req.flash("success"), token })
    } catch (error) {
        console.log(error.msg)
    }

}

export const ResetPassword = async (req, res) => {
    const errors = validationResult(req)
    const { token, newPassword } = req.body
    try {
        if (!errors.isEmpty()) {
            req.flash("errors", errors.array().map((err) => err.msg))
            res.redirect(`/reset/reset-password?token=${token}`);
            return
        }


        // cari users berdasarkan token
        const user = await User.findOne({ where: { resetToken: token } })
        if (!user || user.resetTokenExpires < new Date()) {
            req.flash("errors", ["Token tidak valid atau sudah kadaluarsa"])
            return res.redirect("/reset/forgot-password");
        }

        // cek password baru tidak boleh sama dengan yang lama
        const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if (isSamePassword) {
            req.flash("errors", ["password tidak boleh sama dengan yang lama!"])
            return res.redirect(`/reset/reset-password?token=${token}`);
        }

        // hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10)


        // ganti password baru dan hapus token
        user.password = hashedPassword
        user.resetToken = null
        user.resetTokenExpires = null
        await user.save()

        req.flash("success", ["password berhasil diubah"])
        res.redirect(`/login`);

    } catch (error) {
        console.log(error.msg)
    }

}