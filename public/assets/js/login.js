const base_url = 'http://localhost:3000/';

//Funcion para iniciar sesion en la cuenta bancaria
const inicioSesion = () => {
    //Verificamos que el correo y contrasena sean validos
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;
    const url = `${base_url}usuario/inicio-sesion`;
    const payload = {
        email: email,
        contrasena: contrasena
    };
    //Si los datos son validos entregamos un token de sesion
    axios.post(url, payload)
        .then(response => {
            const data = response.data;
            if (data.error === null) {
                localStorage.setItem('access_token', JSON.stringify(data.data.token_acceso));
                console.log('Cuenta verificada')
                window.location.href = "index.html";
            }
        })
        .catch(error => {
            console.log('Error al iniciar sesion ', error);
        });
};