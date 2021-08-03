require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT;
const mercadopago = require('mercadopago');

const admin = require('firebase-admin');
const serviceAccount = require('./src/cmas-321818-965b6cb73461.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/woke-up', (req, res) => {
  res.send({ message: 'Thanks i woke up!' });
});

app.get('/status-mercado-pago', async (req, res) => {
  const url =
    'https://api.mercadopago.com/checkout/preferences/315731691-6fb02e83-4815-47ab-a131-c67288604833';
  // 'https://api.mercadopago.com/v1/payments/315731691-6fb02e83-4815-47ab-a131-c67288604833';

  const headers = {
    Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
  };

  const { data } = await axios.get(url, { headers });
  console.log(data);
  res.send(data);
});

app.post('/', async (req, res) => {
  const idFirebase = req.body.idFirebase;

  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_TOKEN,
  });

  let preference = {
    items: req.body.items,
    payer: req.body.user,
    back_urls: {
      failure: process.env.HOST_FRONT,
      pending: process.env.HOST_FRONT,
      success: process.env.HOST_FRONT,
    },
    auto_return: 'approved',
  };

  try {
    const { response } = await mercadopago.preferences.create(preference);
    const idMercadoPago = response.id;

    await db.collection('orders').doc(idFirebase).update({ idMercadoPago });

    linkDePago = response.init_point;
    res.send({ linkDePago });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log('SERVIDOR INICIADO EN PUERTO', PORT);
});
