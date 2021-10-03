'use strict'

const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')

exports.register = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    body.activationKey = activationKey
    const user = new User(body)
    const savedUser = await user.save()
    res.status(httpStatus.CREATED)
    res.send(savedUser.transform())
  } catch (error) {
    return next(User.checkDuplicateEmailError(error))
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const payload = {sub: user.id}
    const token = jwt.sign(payload, config.secret)
    return res.json({ message: 'OK', token: token })
  } catch (error) {
    next(error)
  }
}

exports.confirm = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { 'activationKey': req.query.key },
      { 'active': true }
    )
    return res.json({ message: 'OK' })
  } catch (error) {
    next(error)
  }
}


exports.connectedUserInfos = async (req, res, next) => {
  try {
    let resp = await User.findById(req.user._id)
    let user = JSON.stringify(resp)
    user = JSON.parse(user)
    user.total_scanned_beers = user.beers.length
    let favorite_beers = 0
    user.beers.forEach(element => {if(element.favorite) favorite_beers++});
    user.favorite_beers = favorite_beers
    return res.json({ message: 'OK', user})
  } catch (error) {
    next(error)
  }
}

exports.UserInfosById = async (req, res, next) => {
  try {
    let resp = await User.findById(req.params.id)
    let user = JSON.stringify(resp)
    user = JSON.parse(user)
    user.total_scanned_beers = user.beers.length
    let favorite_beers = 0
    user.beers.forEach(element => {if(element.favorite) favorite_beers++});
    user.favorite_beers = favorite_beers
    return res.json({ message: 'OK', user})
  } catch (error) {
    next(error)
  }
}

exports.listBeersConnectedUser = async (req, res, next) => {
  try {
    let resp = await User.findById(req.user._id)
    return res.json({message: 'OK', nb_beers: (resp.beers).length, user_beers: resp.beers})
  } catch (error) {
    next(error)
  }
}
