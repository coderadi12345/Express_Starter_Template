import nodemailer from 'nodemailer'
import { serverConfig } from '.'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:serverConfig.MAIL_USER,
        pass:serverConfig.MAIL_PASS
    }
})
