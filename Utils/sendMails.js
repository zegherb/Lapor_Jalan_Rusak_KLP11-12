import nodemailer from 'nodemailer'

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });

        return true
    } catch (error) {
        console.log(error, "\nemail tidak terkirim");
        return false
    }
};

export { sendEmail }