'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const beerSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: false,
  },
  user_id: {
    type: String,
    required: true,
    unique: false
  },
  comment: {
    type: String,
    required: false,
    maxlength: 128
  },
  rating: {
    type: Number,
    max: 5,
    min: 0
  },
  favorite: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true
})

beerSchema.method({
  transform () {
    const transformed = {}
    const fields = ['code', 'user_id', 'comment', 'rating', 'favorite']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  },
})

beerSchema.statics = {

}

module.exports = mongoose.model('Beers', beerSchema)
