const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true
  },
  description: String,
  category: {
      type: String,
      minlength: 5,
      required: true
  },
  subcategory: String,
  price: {
    type: Number,
    minlength: 1,
    required: true
  },
  date: Date,
  highlighted: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

itemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Item', itemSchema)