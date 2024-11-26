import nodemailer from 'nodemailer';

export const sendEmail = async(destinatario: string, asunto: string, mensaje: string): Promise<boolean>=> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    const mailOptions = {
        from:  process.env.SMTP_USER,
        to: destinatario,
        subject: asunto,
        text: mensaje,
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con exito');
        return true;
        
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
    
}