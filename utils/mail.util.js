const nodemailer = require('nodemailer');
const ejs = require('ejs')
const { convert } = require('html-to-text')

class Email {

  constructor(user, link, amount) {
    this.to = user.email
    this.name = user.name
    this.link = link
    this.amount = amount
  }

  async _createTransporter() {
    return nodemailer.createTransport({

      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@primefinanceltd.com",
        pass: "Gentlesin123$",
      }
    })
  }


  async _send(template, subject) {
    const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, { link: this.link, name: this.name, amount: this.amount })

    const mailOptions = {
      from: 'Prime Finance Limited <info@primefinanceltd.com>', // sender address
      to: this.to,
      subject: subject,
      html,
      text: convert(html),
    }

    const transporter = await this._createTransporter()
    transporter.sendMail(mailOptions)
  }

  async sendWelcome() {
    await this._send("welcome", "Welcome to Prime Finance Limited")
  }
  async sendDeposit() {
    await this._send("deposit", "New Deposit")
  }
  async sendInvestment() {
    await this._send("investment", "New Investment")
  }
  async sendWithdrawal() {
    await this._send("withdrawal", "New Withdrawal")
  }
  async sendForgotPassword() {
    await this._send("forgotPassword", "Forgot Password")
  }


}



module.exports = Email