require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/node_modules', express.static('node_modules'));
app.use(express.static('public'));


// VARIABLES METEOCHILE

const correo = process.env.METEO_USUARIO;
const token = process.env.METEO_TOKEN;

const sanJoseMaipo = process.env.METEO_ESTACION_SANJOSE_MAIPO;

const macul = process.env.METEO_ESTACION_MACUL;

const laFlorida = process.env.METEO_ESTACION_LA_FLORIDA;



// API CLIMA


app.get('/api/clima/sanjose-maipo', async (req, res) => {

    try {

        const url =
            `https://climatologia.meteochile.gob.cl/application/servicios/getDatosRecientesEma/${sanJoseMaipo}?usuario=${correo}&token=${token}`;


        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                `MeteoChile respondió ${respuesta.status}`
            );

        }


        const datos = await respuesta.json();


        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: true,
            mensaje: 'Error obteniendo datos de MeteoChile'
        });

    }

});



// API ESTIMACIÓN


app.get('/api/clima/estimacion/sanjose-maipo', async (req, res) => {

    try {

        const url =
            `https://climatologia.meteochile.gob.cl/application/serviciosb/getDatosModelo/${sanJoseMaipo}?usuario=${correo}&token=${token}`;


        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                `MeteoChile respondió ${respuesta.status}`
            );

        }


        const datos = await respuesta.json();


        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: true,
            mensaje: 'Error obteniendo estimación'
        });

    }

});

app.get('/api/clima/macul', async (req, res) => {
    try {

        const url =
            `https://climatologia.meteochile.gob.cl/application/servicios/getDatosRecientesEma/${macul}?usuario=${correo}&token=${token}`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                `MeteoChile respondió ${respuesta.status}`
            );

        }

        const datos = await respuesta.json();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: true,
            mensaje: 'Error obteniendo datos de MeteoChile'
        });
    }
});


app.get('/api/clima/estimacion/macul', async (req, res) => {
    try {

        const url =
            `https://climatologia.meteochile.gob.cl/application/serviciosb/getDatosModelo/${macul}?usuario=${correo}&token=${token}`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                `MeteoChile respondió ${respuesta.status}`
            );

        }

        const datos = await respuesta.json();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: true,
            mensaje: 'Error obteniendo estimación'
        });

    }
});



app.get('/api/clima/la-florida', async (req, res) => {
    try {

        const url =
            `https://climatologia.meteochile.gob.cl/application/servicios/getDatosRecientesEma/${laFlorida}?usuario=${correo}&token=${token}`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                `MeteoChile respondió ${respuesta.status}`
            );

        }

        const datos = await respuesta.json();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: true,
            mensaje: 'Error obteniendo datos de MeteoChile'
        });
    }
});


app.get('/api/clima/estimacion/la-florida', async (req, res) => {
    try {

        const url =
            `https://climatologia.meteochile.gob.cl/application/serviciosb/getDatosModelo/${laFlorida}?usuario=${correo}&token=${token}`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                `MeteoChile respondió ${respuesta.status}`
            );

        }

        const datos = await respuesta.json();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: true,
            mensaje: 'Error obteniendo estimación'
        });

    }
});






// SERVIDOR


app.listen(port, () => {

    console.log(
        `Servidor corriendo en el puerto ${port}`
    );

});