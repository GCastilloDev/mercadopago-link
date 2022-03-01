require('dotenv').config()
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT
const mercadopago = require('mercadopago')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/woke-up', (req, res) => {
  res.send({ message: 'Thanks i woke up!' })
})

app.post('/', async (req, res) => {

 // Recibe el siguiente objeto por el método post
 // { 
 // "product": "Producto de prueba",
 // "unit_price": 100,
 // "quantity": 10
 // }

  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_TOKEN,
  })
  const unit_price = req.body.unit_price
  const title = req.body.product
  const quantity = req.body.quantity

  const preference = {
    items: [
      {
        title,
        quantity,
        currency_id: 'MXN',
        unit_price,
      },
    ],
  }

  try {
    const { response } = await mercadopago.preferences.create(preference)
    linkDePago = response.init_point
    res.send({ linkDePago })
  } catch (error) {
    console.log(error)
    res.send({ status: 500, msg: 'error' })
  }
})

app.listen(PORT, () => {
  console.log('SERVIDOR INICIADO EN PUERTO', PORT)
})
