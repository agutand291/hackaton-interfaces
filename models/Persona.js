const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");



// Definir el esquema de Contactos
const ContactosSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value); // Solo letras y espacios
            },
            message: "El nombre solo puede contener letras y espacios"
        }
    },
    apellidos: {
        type: String,
        required: [true, "Los apellidos son obligatorios"],
        trim: true
    },
    nombre_usuario: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"]
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true,
        lowercase: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    edad: {
        type: Number,
        min: [0, "La edad no puede ser negativa"],
        max: [120, "La edad no puede ser mayor a 120"]
    },
    foto: {
        type: String,
        default: "imagen_anonimous.png"
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
});


// `pre-save` es para encriptar la contraseña antes de guardar (se podrian meter mas cosas). this se refiere a la propia instacia de la clase modelo.
ContactosSchema.pre("save", async function(next) {
    if (this.isModified("password")) { //Is Modified me detecta automaticamente si yo ya he hecho algún cambio en mi función de callback, lo cual es muyyyyy útil
        this.password = await bcrypt.hash(this.password, 10);
    }
    next(); //Los usos de middlewares requieren de next aveces, como por ejemplo la funcion de callback en el middleware de borrar usuario
});


// Método de instancia para comparar contraseñas
ContactosSchema.methods.comparePassword = async function(password) { //con metod creo el método que a mi me de la gana
    return await bcrypt.compare(password, this.password);
};


model("Persona", ContactosSchema, "personas").createIndexes(); //Esto es para crear lo indices de unicidad


module.exports = model("Persona", ContactosSchema, "personas");








