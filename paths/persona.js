const express= require("express");
const router=express.Router();
const persona_Controller=require('../controllers/persona.js');
const multer=require("multer");
const fs= require("fs").promises
const path=require("path")

const almacenamiento=multer.diskStorage({
    destination: async function(req,file,cb){
        console.log(req.body.nombre_usuario)
        let rootpath=__dirname.split("\\")
        console.log(rootpath)
        rootpath.pop()
        console.log(rootpath)
        rootpath= path.join(...rootpath)
        console.log(rootpath)
 

        const filePath= rootpath + "/imagenes/personas/" + req.body.nombre_usuario
        console.log(filePath)
        await fs.mkdir(filePath, {recursive:true})
        cb(null, './imagenes/personas/'+req.body.nombre_usuario);

    },



    filename: function(req,file,callback){
        const nombre_usuario=req.body.nombre_usuario
        const now = new Date(Date.now());

        // Obtener componentes de la fecha
        const year = now.getFullYear(); // Año
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); //relleno con 0's hasta tener dos strings
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Formatear la fecha en el formato deseado (Ej: YYYY-MM-DD_HH-MM-SS)
        const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        callback(null, nombre_usuario + "_" + formattedDate + "_" + file.originalname)
    }
})

const validarExtension = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase(); // Obtener la extensión y convertirla a minúsculas

    // Verificar si la extensión es PNG
    if (extension !== '.png') {
        // En vez de usar un console.log, podemos pasar un mensaje al callback
        req.fileValidationError = 'Error'; //ESTOY CON UN MIDDLEWARE !!!PUEDO HACER COSAS EN MEDIO!!! Que podamos enviar al usuario con qué tipo de eroor nos encontramos
        //return cb(null, false);  Por poder... se puede poner, pero nos va a generar un error
        return cb(null, false);
    }

    // Si la extensión es válida, permitimos el archivo
    return cb(null, true);  // Aceptamos el archivo. null indica que no hay ningun error (se podria pasar un error ahi, true indica que el archivo ha pasado con exito)
};

const subidas=multer({
    storage:almacenamiento,
    fileFilter: validarExtension
});







//-------------------------
router.post("/usuario",[subidas.single("foto")], persona_Controller.create) //Ruta que nos permite crear el usuario en la db
router.put('/usuario/:name', persona_Controller.changePassword) //Ruta que nos permite cambiar contraseñas,emails. Es protegida por el middleware
router.delete("/usuario/:name?",persona_Controller.verificarToken, persona_Controller.delete_One) //Ruta que nos permite borrar usuarios.



//---------------------------
router.post("/", persona_Controller.start_session)  //Ruta que nos permite obtener el token de inicio de sesión
router.get("/:name?",persona_Controller.verificarToken, persona_Controller.getphoto) //Ruta que nos permite obtener la foto del usuario al iniciar sesión











//MUY IMPORTANTE AQUÍ EXORTAMOS EL ROUTER
module.exports ={router} //¡Devuelvo mis rutas¡¡¡¡