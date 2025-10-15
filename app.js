const express = require('express')

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get("/dashboard",(req,res)=>{
    res.render("dashboard")
    // res.send("hello world")
})

app.get("/history",(req,res)=>{
    res.render("history")
})

app.get("/home",(req,res)=>{
    res.render("index")
})

app.get("/auth/login",(req,res)=>{
    res.render("auth/login")
})

app.get("/auth/register",(req,res)=>{
    res.render("auth/register")
})

app.get("/auth/passwordforgot",(req,res)=>{
    res.render("auth/forgot_password")
})

app.get("/auth/passwordreset",(req,res)=>{
    res.render("auth/reset_password")
})


app.listen(PORT,()=>{
    console.log(`app listening at http//:localhost:${PORT}`)
})