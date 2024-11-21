
const validator= require("validator");
const Persona=require("../models/Persona.js")
const bcrypt=require("bcrypt")
const jwt= require('jsonwebtoken')
const path=require('path')


//----------------------función para guardar los datos de usuario en la db-------------------
async function create(req, res) {
    const parametros = req.body; // Obtenemos los datos enviados en el POST. AQUÍ NO HAY IMAGEN REQ BODY Y REQ FILE SE SPARAN AUTOMATICAMENTE
    console.log(req.body)

    try {
        // Validamos los campos `nombre` y `apellidos` usando validator
        let evalue_title = validator.isEmpty(parametros.nombre);
        let evalue_content = validator.isEmpty(parametros.apellidos);

        if (evalue_title === true || evalue_content === true) {
            throw new Error("No se ha validado la información");
        }
        console.log("Datos validados correctamente");
    } catch (error) {
        console.log(error.stack);
        return res.status(400).json({
            status: "error",
            mensaje: "Hay fallos en la validación",
            error: error.message,
            linea: error.stack    
        });
    }
    

    if (req.fileValidationError === 'Error'){
        console.log(req.fileValidationError)
        return res.status(400).json({
            status: "error",
            message: "Has pasado una extension no valida de imagen",
        })
    }


    if (req.file) {
        parametros["foto"] = req.file.path;
        console.log(req.body)
    } else {
        console.log("No se ha subido ningún archivo");
    }

    const persona_model = new Persona(parametros);
    console.log("Parámetros finales:", parametros);

    try {
        console.log("Intentando guardar en la base de datos...");
        const personasaved = await persona_model.save(); // Mongoose se encargará del encriptado de la contraseña aqui gracia a pre
        console.log("Guardado en la BD!")
        return res.status(200).json({
            status: "finalizado con éxito",
            persona: personasaved
        });
    } catch(error){
        console.log(error)
        return res.status(400).json({
            status: "error",
            message: error.message,

            
        });
    }
}







////-----------funcion para obtener token--------------------------
async function start_session (req, res) {
    try {
        //let name_persona = req.params.name;
        const body= req.body
        console.log(body)
        const name_persona=req.body.name_persona;

        // Busca una persona por el campo `name`
        const persona = await Persona.findOne({ nombre_usuario: name_persona });
        if (!persona || !persona.password) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado la persona en la db",
            });
        }

        else{
            let userForToken={
                id:persona._id,
                nombre_usuario:persona.nombre_usuario
            }

            const token=jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: '1h' });
            console.log("Mi token es"+ token) //token para proteger rutas como mi ruta delete
            const is_corrrect= await bcrypt.compare(body.password, persona.password)
            if (!is_corrrect){
                res.status(401).json({
                    error: "Usuario Invalido",

                })
            }

            else{


                res.cookie('token', token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 60*60*1000),
                    secure: false,
                    sameSite:"lax"

                }).status(200).send(userForToken)

            }
        }

    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            status: "error",
            mensaje: error.message,
        });
    }
}

//-----------MIDDLEWARE para verificar token--------------------------
function verificarToken(req, res, next) {
    //const token = req.headers['authorization'];
    const token = req.cookies['token']
    console.log(token)
    if (!token) {
        return res.status(403).json({ mensaje: "No se proporcionó un token o el toquen a caaducado" }); // En el cliente se debería mopstrar algo como SESIÓN CADUCADA SIEMPRE
    }

    // Verifica el token JWT
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: "Token inválido" });
        }
        req.usuario=decoded
        console.log(decoded)
        console.log(req.params.name)
        if (req.usuario.nombre_usuario!=req.params.name){
            return res.status(401).json({mensaje:"Personal no autorizado"})
        }
        next()
    });
    
}


//----------------------función para borrar usuario de la db-------------------
async function delete_One(req, res) {
    let name_persona_borrar = req.params.name;
    console.log(name_persona_borrar);
    try {
        
        console.log("Antes de borrar");
        const result = await Persona.deleteOne({ nombre_usuario: name_persona_borrar });
        console.log("Hemos borrado");

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado ninguna persona con ese nombre en la db",
            });
        }

        return res.status(200).json({
            status: "exito",
            mensaje: `La persona con el nombre ${name_persona_borrar} ha sido eliminada`,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al intentar borrar la persona en la db",
            error: error.message,
            linea: error.stack
        });
    }
}



//----------------------función para editar contraseña de la db-------------------
async function changePassword(req,res){
  

}


//----------Middlware para comparar contraseña-----------------------

async function checkPassword(req,res, next){
  

}



//----------------------función para obtener la foto de usuario de la db-------------------
async function getphoto (req,res) {
    try{
        const nombre_usuario=req.params.name
        console.log(nombre_usuario)
        const persona= await Persona.findOne({nombre_usuario:nombre_usuario})
        console.log(persona)
        if (!persona){
            res.status(401).json({
                mensaje:"Error mandado usuario"
            })
        }

        let rootpath=__dirname.split("\\") 
        console.log(rootpath)
        rootpath.pop()
        console.log(rootpath)
        rootpath= path.join(...rootpath)
        console.log(rootpath)

        console.log(persona.foto)
        const filePath= rootpath + "/" + persona.foto
        console.log(filePath)


        res.status(200).sendFile(filePath)
    }
    catch(error){
        return res.status(400).json({
            linea:error.stack,
            mensaje:error.message
        })

    }
}




module.exports={
    verificarToken,
    create,
    start_session,
    delete_One,
    changePassword,
    checkPassword,
    getphoto
    
}