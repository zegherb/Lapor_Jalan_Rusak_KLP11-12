
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js"; 

dotenv.config();

export const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            // kalau request dari browser, redirect ke login; kalau API, respon JSON
            if (req.accepts("html")) return res.redirect("/login");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // simpan payload ke req.user
        req.user = decoded;
        return next();
    } catch (err) {
        // token invalid / expired
        if (req.accepts("html")) {
            req.flash("errors", ["Sesi berakhir, silakan login ulang"]);
            return res.redirect("/login");
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

// middleware khusus untuk halaman EJS: biarkan res.locals.user tersedia di view
export const populateUser = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.locals.user = null;
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = decoded; // { id, role, username, iat, exp }
        return next();
    } catch (err) {
        res.locals.user = null;
        return next();
    }
};

// cek kalau user harus admin
export const requireAdmin = (req, res, next) => {
    // pastikan sudah ada req.user (jalankan requireAuth sebelum requireAdmin)
    if (!req.user) {
        if (req.accepts("html")) return res.redirect("/auth/login");
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
        if (req.accepts("html")) {
            req.flash("errors", ["Akses ditolak"]);
            return res.redirect("/auth/login");
        }
        return res.status(403).json({ message: "Forbidden" });
    }

    return next();
};
