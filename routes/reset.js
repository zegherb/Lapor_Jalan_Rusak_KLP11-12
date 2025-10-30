import express from 'express'
import { body } from 'express-validator'
import { getForgotPassword ,getResetPassword,ForgotPassword,ResetPassword} from '../controllers/resetControllers.js'


const router = express.Router()

// get ke halaman forgot password
router.get("/forgot-password",getForgotPassword)

// get ke ubah password
router.get('/reset-password',getResetPassword)


// validasi dan cek email yang user masukan
router.post("/forgot-password",body('email',"masukkan email yang valid").isEmail(),ForgotPassword)

// 
router.post("/reset-password",body('newPassword',"password harus lebih dari 8 karakter").isLength({min: 8}),ResetPassword)


export default router