const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
})

const forgotPasswordTemplate = (token) => {
  const  url = `${process.env.FRONT_URL}/reset-password?token=${token}`;
  return {
    subject: 'Super Hero app (Forgot Password)',
    text: `Seems like you forgot your password for super hero app. if this is true, click on the link below to reset your password \n ${url}`,
    html: `
      <h1>Password Reset</h1>
      <p>Seems like you forgot your password for super hero app. if this is true, click on the link below to reset your password</p>
      <a href="${url}">Reset Password</a>`
  }
}

const verifyUserTemplate = (token) => {
  const  url = `${process.env.FRONT_URL}/verify?token=${token}`;
  return {
    subject: 'Super Hero app (Verify account)',
    text: `To verify your account click on the link below... \n ${url}`,
    html: `
      <h1>Verify Account</h1>
      <p>To verify your account click on the link below</p>
      <a href="${url}">Verify</a>`
  }
}

module.exports = {
  sendForgotPasswordEmail: async (email, token) => {
    console.log('send password func')
    const body = forgotPasswordTemplate(token)

    const info = await transporter.sendMail({
      from: 'Job Company <support@company.com>',
      to:  email,
      subject: body.subject,
      text: body.text,
      html: body.html,
    })
    return info.response
  },

  sendRegistrationEmail: (email, token)  => {
    const body = verifyUserTemplate(token)
    transporter.sendMail({
      from: 'Job Company <support@company.com>',
      to:  email,
      subject: body.subject,
      text: body.text,
      html: body.html,
    })
  }
}
