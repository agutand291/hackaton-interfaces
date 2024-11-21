document.addEventListener('DOMContentLoaded', () => {
    var parrafo_info = document.getElementById('usuario_creado');
    parrafo_info.style.display = 'none';

    //-------------- addEventListener para mostrar la vista previa de la imagen seleccionada ----------------
    document.getElementById('foto').addEventListener('change', function (event) {
        const file = event.target.files[0]; // event.target.files es un array....
        const reader = new FileReader(); // creamos un objeto FileReader

        if (file) {
            // conceptualmente lo que hacemos en lo siguiente es interesante y complejo al mismo tiempo
            reader.onload = function (e) {
                const imgElement = document.getElementById('imagenVistaPrevia');
                imgElement.src = e.target.result; // Establecemos la fuente de la imagen como la cargada
                imgElement.style.display = 'block'; // Hacemos visible la imagen
            };

            reader.readAsDataURL(file); // Leemos el archivo como una URL de datos (base64)
        }
    });

    //-------------- addEventListener para mostrar especificar que va a hacer el formulario cuando le demos a submit ---------------
    document.getElementById('createForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(this); // Obtiene todos los datos del formulario, incluyendo la imagen

        //---- OJO BORRAMOS LOS INPUTS QUE NO QUEREMOS ----
        formData.delete('password_check'); // Borramos el campo password_check del FormData
        //---------------------------------------------

        // Verificamos las contraseñas antes de continuar
        const password = document.getElementById('password').value;
        const passwordCheck = document.getElementById('password_check').value;
        let parrafo_info = document.getElementById('parrafo_info'); // Asumimos que tienes un parrafo para mostrar el mensaje de error
        console.log(parrafo_info)

        if (password !== passwordCheck) {
            parrafo_info.style.color = 'red';
            parrafo_info.style.textAlign = 'center';
            parrafo_info.textContent = 'Las contraseñas no coinciden.';
            parrafo_info.style.display = 'block';
            return; // Detenemos la ejecución si las contraseñas no coinciden
        }

        try {
            // Enviar la solicitud con FormData que incluye tanto los datos como la imagen
            const response = await fetch('http://localhost:5050/usuario', {
                method: 'POST',
                body: formData, // Usamos FormData en lugar de JSON
            });

            if (!response.ok) {
                const result = await response.json();
                console.log(result)
                console.log(result.message)
                parrafo_info.style.color = 'red';
                parrafo_info.textContent = "Error:" +result.message;
                parrafo_info.style.display = "block";

                return
            }

            // Si la respuesta es exitosa
            const result = await response.json();
            console.log("Éxito:", result);
            parrafo_info.textContent = 'Usuario creado con éxito';
            parrafo_info.style.display = "block";
            parrafo_info.style.color = "blue";
            parrafo_info.style.textAlign = "center";

            setTimeout(function () {
                window.location.href = "Iniciar_sesion.html";
            }, 3000);

        } catch (error) {
            // Si hay un error en la solicitud, mostramos el mensaje de error
            console.log(error);
            parrafo_info.style.color = 'red';
            parrafo_info.textContent = `Error: ${error.message}`;
            parrafo_info.style.display = "block";
        }
    });

    // Función para limpiar el formulario
    document.getElementById('limpiar').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('createForm').reset();
        const parrafo_info = document.getElementById('parrafo_info');
        parrafo_info.style.display = 'none';
        console.log("Formulario limpiado");
    });
});
