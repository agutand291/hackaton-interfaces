document.addEventListener('DOMContentLoaded', () => {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';


    document.getElementById('comparePassword').addEventListener('click', async function() {
        const nombreUsuario = document.getElementById('nombre_usuario').value;
        console.log(nombreUsuario)
        const password = document.getElementById('password').value;
        console.log(password)
        let jsonbody=JSON.stringify({
            password:password,
            name_persona:nombreUsuario
        })
        console.log("El json body es"+jsonbody)
    
        try {
            const response = await fetch(`http://localhost:5050`,{
                method:"POST",
                //credentials: 'include', // Importante para enviar cookies con la solicitud
                body:jsonbody,
                headers:{
                    "Content-Type":"application/json"
                },
            });
            
            if (!response.ok) {
                console.log('Contraseña incorrecta');
                const errorMessage = document.getElementById('error-message');
                errorMessage.style.display = 'block';
                errorMessage.style.color = 'red'
                return
            }
            else{
                console.log(document.cookie);
                console.log(response)
                //window.location.href = 'pagina_exitosa.html' para quitar la ventana actual

                localStorage.setItem('nombre_usuario', nombreUsuario);


                window.open('Sesion_iniciada.html', '_blank')


                }
            } 
     catch (error) {
            console.error("Error:", error.message);
        }
    });
    
    //Se puede hacer sinproblema sin manejo de eventos. Es recomendable que lo hagais tambien
    document.getElementById('limpiar').addEventListener('click', function(event) {
        event.preventDefault();
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'none'
        document.getElementById('registrationForm').reset();
        console.log("Formulario limpiado");
    });
});


