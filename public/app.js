function corregirUTF8(texto) {

    try {
        return decodeURIComponent(
            Array.prototype.map.call(texto, c =>
                '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
            ).join('')
        );
    } catch (e) {
        return texto;
    }
}

const estaciones ={
    sanjoseMaipo: 'sanjose-maipo',
    macul: 'macul',
    laFlorida: 'la-florida'
}

async function cargarClima(estacion = 'macul') {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/clima/${estacion}`)

        if (!respuesta.ok) {
            throw new Error('Error obteniendo datos');
        }

        const datos = await respuesta.json();

        console.log(datos);

        const nombre = datos.datosEstaciones.estacion.nombreEstacion;

        document.getElementById('nombreEstacion').textContent =
            corregirUTF8(nombre);

        const momento = datos.datosEstaciones.datos[1].momento;

        const fecha = new Date(momento.replace(' ', 'T'));

        // Restar 4 horas
        fecha.setHours(fecha.getHours() - 4);

        const fechaFormateada = fecha.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const horaFormateada = fecha.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        document.getElementById('hora').textContent =
            `${fechaFormateada} ${horaFormateada}`;

        document.getElementById('temperatura').textContent =
            datos.datosEstaciones.datos[1].temperatura;

        document.getElementById('humedad').textContent =
            datos.datosEstaciones.datos[1].humedadRelativa;

        document.getElementById('viento').textContent =
            datos.datosEstaciones.datos[1].fuerzaDelViento;

        document.getElementById('radiacion').textContent =
            datos?.datosEstaciones?.datos?.[1]?.radiacionGlobalInst ?? 'N/A';

        document.getElementById('estadoCielo').textContent =
            obtenerEstadoCielo(datos.datosEstaciones.datos[1]);

        const estadoCielo = obtenerEstadoCielo(datos.datosEstaciones.datos[1]);

        document.getElementById('estadoCielo').textContent = estadoCielo;

        const iconoClima = document.getElementById('iconoClima');

        iconoClima.className = `bi fs-1 ${obtenerIcono(estadoCielo)}`;
       

    } catch (error) {
        console.error(error);
    }
}

async function cargarPronostico(estacion = 'macul') {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/clima/estimacion/${estacion}`)
        if (!respuesta.ok) {
            throw new Error('Error obteniendo datos');
        }
        const datos = await respuesta.json();
        console.log(datos);
        pintarPronostico(datos.elementos[0]["12_00_ecmwf"].valorPronosticado , datos.elementos[6]["13_00_ecmwf"].valorPronosticado);
        pintarGraficoTemperatura(datos.elementos[0]["12_00_ecmwf"].valorPronosticado);
    } catch (error) {
        console.error(error);
    }
}


function obtenerEstadoCielo(clima) {
    console.log(clima);
    const lluvia = parseFloat(
        (clima.aguaCaidaDelMinuto || "0")
            .replace(" mm", "")
            .replace(",", ".")
    );

    const radiacion = parseFloat(
    String(clima.radiacionGlobalInst ?? "0")
            .replace(" Watt/m2", "")
            .replace(",", ".")
    ) || 0;

    const fecha = new Date(clima.momento.replace(" ", "T"));

    fecha.setHours(fecha.getHours() - 4);

    const hora = fecha.getHours();

    // Si está lloviendo ahora
    if (lluvia > 0) {
        return "Lluvia";
    }

    // Noche
    if (hora < 6 || hora >= 19) {
        return "Noche";
    }

    // Estado según radiación
    if (radiacion < 100) {
        return "Nublado";
    }

    if (radiacion < 450) {
        return "Parcialmente nublado";
    }

    return "Soleado";
}

function obtenerIcono(estado) {
    switch (estado) {
        case "Lluvia":
            return "bi-cloud-rain";
        case "Noche":
            return "bi-moon";
        case "Nublado":
            return "bi-cloudy";
        case "Parcialmente nublado":
            return "bi-cloud-sun";
        case "Soleado":
            return "bi-sun";
        default:
            return "bi-cloudy";
    }
}

function obtenerProximas24Horas(datos) {

    const ahora = new Date();

    const limite = new Date(
        ahora.getTime() + (24 * 60 * 60 * 1000)
    );

    return datos.filter(item => {

        const fecha = new Date(
            item.fecha.replace(' ', 'T')
        );

        fecha.setHours(fecha.getHours() + 4);

        return fecha >= ahora && fecha <= limite;
    });
}

function pintarPronostico(datos, aguaAcumulada) {

    console.log(datos);
    console.log(aguaAcumulada);

    const contenedor = document.getElementById('pronostico');

    contenedor.innerHTML = '';

    // Próximas 24 horas
    const datos24h = obtenerProximas24Horas(datos);
    const datos24hAgua = obtenerProximas24Horas(aguaAcumulada);

    datos24h.forEach(item => {

        const fecha = new Date(
            item.fecha.replace(' ', 'T')
        );

        // Restar 4 horas
        fecha.setHours(fecha.getHours() - 4);

        const hora = fecha.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        // Buscar la lluvia correspondiente a esta hora
        const lluvia = datos24hAgua.find(agua => {

            const fechaAgua = new Date(
                agua.fecha.replace(' ', 'T')
            );

            fechaAgua.setHours(
                fechaAgua.getHours() - 4
            );

            return fechaAgua.getTime() === fecha.getTime();
        });

        const mmLluvia = lluvia
            ? parseFloat(lluvia.valor)
            : 0;

        const div = document.createElement('div');

        div.className = 'text-center';

        div.style.width = '72px';
        div.style.minWidth = '70px';

        div.innerHTML = `
            <small>${hora}</small>

            <div class="my-2">
                <i class="bi bi-cloud-sun fs-4"></i>
            </div>

            <strong>
                ${parseFloat(item.valor).toFixed(1)}°C
            </strong>

            <div class="mt-1 small">
                ${mmLluvia > 0
                    ? `🌧️ ${mmLluvia.toFixed(2)} mm`
                    : '☀️ 0 mm'
                }
            </div>
        `;

        contenedor.appendChild(div);
    });
}

let graficoTemperatura = null;

function pintarGraficoTemperatura(datos) {

    // Mismos datos que el pronóstico
    const datos24h = obtenerProximas24Horas(datos);

    const canvas = document.getElementById('graficoTemperatura');

    if (graficoTemperatura) {
        graficoTemperatura.destroy();
        graficoTemperatura = null;
    }

    canvas.removeAttribute('width');
    canvas.removeAttribute('height');

    const ancho = datos24h.length * 70;

    canvas.style.width = `${ancho}px`;
    canvas.style.height = '250px';

    const labels = datos24h.map(item => {

        const fecha = new Date(
            item.fecha.replace(' ', 'T')
        );

        return fecha.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    const temperaturas = datos24h.map(item =>
        parseFloat(item.valor)
    );



    graficoTemperatura = new Chart(canvas, {

        type: 'line',

        data: {
            labels: labels,

            datasets: [{
                label: 'Temperatura',
                data: temperaturas,

                borderWidth: 2,
                tension: 0.4,

                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },

        options: {

            responsive: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return `${context.parsed.y.toFixed(1)} °C`;

                        }
                    }
                }
            },

            scales: {

                x: {
                    display: false
                },

                y: {
                    title: {
                        display: true,
                        text: 'Temperatura °C',
                    }
                }
            }
        }
    });
}

document.getElementById('selectorEstacion')
    .addEventListener('change', function () {

        cargarClima(this.value);
        cargarPronostico(this.value);

    });
cargarClima();
cargarPronostico();