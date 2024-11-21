const mongoose = require("mongoose");

async function conexion() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Contacto");
        console.log("¡Nos hemos conectado!");
    } catch (error) {  // Captura el error y lo almacena en la variable 'error'
        console.log(error);  // Imprime el error capturado
        console.log("La conexión ha fallado");
    }
}

module.exports = { conexion };

