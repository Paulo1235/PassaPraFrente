import express from 'express'

const userRouter = express.Router()

userRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World'
  })
})

userRouter.get('/sup', (req, res) => {
  res.status(202).json({
    message: 'Impressive, very nice.'
  })
})
