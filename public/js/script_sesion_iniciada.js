document.getElementById('Volver_Inicio').addEventListener('click', function() {
    window.location.href = 'Iniciar_sesion.html';
});

document.getElementById('Eliminar_cuenta').addEventListener('click', async function() {

//---------------Lo siguiente es el fetch para borrar usuario--------------
    const confirmDelete = confirm("¿Estás seguro que quieres borrar la cuenta?");
    if (confirmDelete) {
        const nombre_usuario = localStorage.getItem('nombre_usuario');
        //const token = localStorage.getItem('token');
        if (!nombre_usuario) {
            alert("No se encontró el nombre de usuario en localStorage.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5050/usuario/${nombre_usuario}`,
                {
                    method:"DELETE",
                    headers:{
                        //'Authorization':token,
                        'Content-Type': "aplication/json"
                    },
                    credentials:"include"
                }
            );
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del usuario');
            }
            
            const usuarioData = await response.json();
            console.log(nombre_usuario)
            console.log(usuarioData)
            window.location.href = 'Iniciar_sesion.html';
            localStorage.removeItem('nombre_usuario')
            localStorage.removeItem('token')
            } 
         catch (error) {
            console.error("Error:", error.message);
            alert("Ocurrió un error al intentar eliminar..");
            }
    }
});

//---------------Lo siguiente es el fetch para obtener la foto del servidor--------------
let contendor=document.getElementById("contenido_total")
async function photo(){

    try {
        const user=localStorage.getItem("nombre_usuario")
        console.log(user)
        const response = await fetch(`http://localhost:5050/`+user,
            {
                method:"GET",
                headers:{
                    //'Authorization':token,
                    'Content-Type': "application/json"
                },
                credentials:"include"
            }
        );
        if (!response.ok) {
            throw new Error('No se pudo obtener la información del usuario');
        }
        
        const usuarioData = await response.blob();
        const imagenBlobURL= URL.createObjectURL(usuarioData)
        console.log(imagenBlobURL)
        let imagen_child=document.createElement("img")
        imagen_child.src=imagenBlobURL
        imagen_child.style.maxWidth = "20vw"
        contendor.appendChild(imagen_child)

        } 
    catch (error) {
        console.error("Error:", error.message);
        alert("Ocurrió un error al intentar eliminar..");
        }
}
photo()

