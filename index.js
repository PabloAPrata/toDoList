// Chamando as dependencias e gravando os pacotes em constantes para trabalhar com eles no Javascript
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./config/routes')

// Iniciando o servidor

const app = express()

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(express.static('public'));

// Ligando o servidor
app.listen(3000, () => {
    console.log(`express started at http://localhost:3000`)
});