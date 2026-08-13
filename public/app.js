async function cargarClima() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/clima/macul')

        if (!respuesta.ok) {
            throw new Error('Error obteniendo datos');
        }

        const datos = await respuesta.json();

        console.log(datos);

        document.getElementById('nombreEstacion').textContent =
            datos.datosEstaciones.estacion.nombreEstacion ;

        document.getElementById('hora').textContent =
            datos.datosEstaciones.datos[1].momento;

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
        
        document.getElementById('iconoClima').classList.add(
            obtenerIcono(obtenerEstadoCielo(datos.datosEstaciones.datos[1]))
        );

    } catch (error) {
        console.error(error);
    }
}

async function cargarPronostico() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/clima/estimacion/macul')
        if (!respuesta.ok) {
            throw new Error('Error obteniendo datos');
        }
        const datos = await respuesta.json();
        console.log(datos);
        pintarPronostico(datos.elementos[0]["12_00_ecmwf"].valorPronosticado);
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

    const hora = new Date(clima.momento.replace(" ", "T")).getHours();

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

function pintarPronostico(datos) {

    console.log(datos);

    const contenedor = document.getElementById('pronostico');

    contenedor.innerHTML = '';

    datos.forEach(item => {

        const fecha = new Date(item.fecha.replace(' ', 'T'));

        const hora = fecha.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const div = document.createElement('div');

        div.className = 'text-center';

        div.style.minWidth = '65px';

        div.innerHTML = `
            <small>${hora}</small>

            <div class="my-2">
                <i class="bi bi-cloud-sun fs-4"></i>
            </div>

            <strong>${parseFloat(item.valor).toFixed(1)}°</strong>
        `;

        contenedor.appendChild(div);
    });
}

cargarClima();
cargarPronostico();