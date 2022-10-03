// Chamando as dependencias e gravando os pacotes em constantes para trabalhar com eles no Javascript
const express = require('express');
const routes = require('./config/routes')

const app = express()

app.use(express.json());
app.use(routes);
app.use(express.static('public'));

// Ligando o servidor
app.listen(3000, () => {
    console.log(`express started at http://localhost:3000`)
});