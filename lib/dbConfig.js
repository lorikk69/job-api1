const mongoose = require('mongoose')
module.exports = {
  connect: () => {
    mongoose.connect(process.env.DB_URL, () => {
      console.log('db connected')
      userController.checkForAdmin()
    })
  },
}