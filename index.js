const conector=require("./database/conexion.js")
const express= require("express")
const cors= require("cors")
const persona_paths= require("./paths/persona.js")
const cookieParser = require('cookie-parser');

console.log("Iniciamos")
conector.conexion() //Dentro del try se nos printea que estamos conectados
require("dotenv").config()


const app= express();
app.use(cors()); //me permite conexiones entre dominios cruzados

app.use(express.static('public'))



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true})) //Esto lo uso para poder hacer el fetch de script.py con distntos contenidos en el fetch


//Escuchar peticiones http
app.listen(5050, function(){
    console.log("escuchando en dicho puerto 5050")
})


//Rutas
app.use(persona_paths.router)







