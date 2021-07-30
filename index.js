require('dotenv').config();
const express = require('express');
const cors = require('cors');


const mercadopago = require('mercadopago');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());


app.get("/prueba", (req, res) => {
    res.send({ message: 'OK' });
})

app.post('/', (req, res) => {

    console.log(req.body);

    mercadopago.configure({
        access_token: process.env.MERCADO_PAGO_TOKEN
    });
    
    let preference = {
    items: req.body.items,
    payer: req.body.user,
    back_urls: {
        failure: process.env.HOST_FRONT,
        pending: process.env.HOST_FRONT,
        success: process.env.HOST_FRONT,
    },
    auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
    .then(function({response}){
    const linkDePago =  response.init_point;
    res.send({linkDePago})
    }).catch(function (error) {
    console.log(error);
    });
})


app.listen(PORT, () => {
    console.log("SERVIDOR INICIADO EN PUERTO 3000");
})