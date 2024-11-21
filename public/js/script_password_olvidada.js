document.addEventListener('DOMContentLoaded', () => {
    

//----El siguiente addEventListener es para editar la contra seña del usuario-------------
    document.getElementById('comparePassword').addEventListener('click', async function() {
        const nombreUsuario = document.getElementById('nombre_usuario').value;
        console.log(nombreUsuario)
        const password = document.getElementById('password').value;
        console.log(password)
        const newPassword = document.getElementById('new_password').value;
        console.log(newPassword)
        let jsonbody=JSON.stringify({
            password:password,
            new_password:newPassword,
            name_persona:nombreUsuario
        })
        console.log("El json body es" + jsonbody)

        try {
            const response = await fetch(`http://localhost:5050`, {
                method:"POST",
                body:jsonbody,
                headers:{
                    "Content-Type":"application/json"
                },
            });

            if(!response.ok) {
                console.log('Contraseña incorrecta');
                const errorMessage = document.getElementById('error-message');
                errorMessage.style.display = 'block';
                errorMessage.style.color = 'red'
                return
            }
            else{
                const result = await response.json();
                console.log("Exito" + result)

                console.log(result)
            }
        
        }
        catch (error) {
            console.error("Error:", error.message);
        }
     
    });
    
    //-----------Aquí definimos lo que pasa en el botón de limpiar----------
    document.getElementById('limpiar').addEventListener('click', function(event) {
     
    });

});


