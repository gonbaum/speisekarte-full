const itemsRouter = require('express').Router()
const Item = require('../models/item')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')

// GET

// All items:
itemsRouter.get('/', async (request, response) => {
  const items = await Item.find({})
    // Join user information to items
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(items.map(item => item.toJSON()))
})

// Item by ID:
itemsRouter.get('/:id', async (request, response) => {
  const item = await Item.findById(request.params.id)
  if (item) {
    response.json(item.toJSON())
  } else {
    response.status(404).end()
  }
})

// POST

// Get Token:
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// Post an item:
itemsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } // Token implementation
  const user = await User.findById(decodedToken.id)

  const item = new Item({
    name: body.name,
    description: body.description,
    img: body.img,
    category: body.category,
    subcategory: body.subcategory,
    price: body.price,
    highlighted: body.highlighted === undefined ? false : body.highlighted,
    date: new Date(),
    user: user._id
  })

  const savedItem = await item.save()
  user.items = user.items.concat(savedItem._id)
  await user.save()

  response.json(savedItem.toJSON())
})

// DELETE

// Delete an item
itemsRouter.delete('/:id', async (request, response) => {
  await Item.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// PUT

// Update an item:
itemsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const item = {
    name: body.name,
    description: body.description,
    img: body.img,
    category: body.category,
    subcategory: body.subcategory,
    price: body.price,
    highlighted: body.highlighted === undefined ? false : body.highlighted
  }

  const updatedItem = await Item.findByIdAndUpdate(request.params.id, item, { new: true })
  response.json(updatedItem.toJSON())

})

module.exports = itemsRouter