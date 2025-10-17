import express from 'express'
import { body } from 'express-validator'
import {  getRegister, register, getLogin, login,logout } from '../controllers/authcontrollers.js'

const router = express.Router();

// halaman form
// Halaman form
router.get("/register", getRegister);
router.get("/login", getLogin);

// routes ke signup
router.post("/register", [
    body('username', "Masukkan nama terlebih dahulu").trim().notEmpty(),
    body('email', "masukkan email yang valid").isEmail(),
    body('password', "password minimal 8 karakter").isLength({ min: 8 })
], register);

// routes ke login
router.post("/login", [
    body('email', "masukkan email yang valid").isEmail(),
    body('password', "password minimal 8 karakter").isLength({ min: 8 })
], login);

// logout 
router.get('/logout',logout)

export default router