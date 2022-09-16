const userService = require('../services/user.service')
const bcrypt = require('bcrypt')

const emailService = require('../services/email.service')
const jwt = require('jsonwebtoken')
const constants = require('../lib/constants')

module.exports = {
  add: async (params) => {
    const { password, firstName, lastName, age, email } = params

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT))

    const result = await userService.insert({
      password: hashedPassword,
      firstName,
      lastName,
      age,
      email,
    })
    const token = jwt.sign({ _id: result._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }, process.env.JWT_VERIFY_SECRET)
    emailService.sendRegistrationEmail(email, token)
    return result._id
  },

  changePassword: async (password, id) => {
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
    const result = await userService.updatePassword(id, hashedPassword)
    return result._id
  },
  verifyAccount: async (id) => {
    const result = await userService.verifyAccount(id)
    return result._id
  },
  checkForAdmin: async () => {
    const admins = await userService.getAdmins()
    if (!admins) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, parseInt(process.env.SALT))
      const admin = {
        firstName: 'ADMIN',
        lastName: 'ADMIN',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        verified: true,
        role: constants.role.ADMIN,
      }
      userService.insert(admin)
    }
  },
 

}