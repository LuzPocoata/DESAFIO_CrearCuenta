//ESTE ES EL JAVASCRIPT 

// Variables para meter los datos del usuario
var usuarioNombre = "";
var usuarioCorreo = "";
var usuarioTelefono = "";
var usuarioContrasena = "";
var usuarioBloqueado = false;        
var usuarioIntentosFallidos = 0;

// Las expresiones regulares que usted sugirio
var regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
var regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var regexTelefono = /^(6|7)[0-9]{7,12}$/;     //le aumente (6|7) para que solo acepte numeros telefonicos que empiecen en 6 o 7
var regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

// transformamos los datos (para evitar errrores en el correo)
function codificarDato(dato) {
    var codificado = "";
    for (var i = 0; i < dato.length; i++) {
        var char = dato[i];  // la palabra char (que se puede cambiar por cualquier otra palabra pero que no altere el codigo) sera usado para que sea una variable y para referirse a los datos ingresados
        if (char === " ") {
            codificado += "_"; //en caso de que hallamos metido un espacio de volvera un guion bajo
        } else if (char === "@") {
            codificado += "-at-";  //en caso de aver puesto @ (normal) lo convertira a -at- para verificar errores
        } else if (char === ".") {
            codificado += "-dot-"; //aqui lo mismo para el punto 
        } else {
            codificado += char;
        }
    }
    return codificado;
}
//con esta funcion volvemos al lo que era correcto
function decodificarDato(codificado) {
    var decodificado = "";
    var i = 0;
    while (i < codificado.length) {
        if (codificado.substr(i, 4) === "-at-") {  //el substr usa las posiciones (inicio, final)
            decodificado += "@";       //al -at- lo vuelve otra vez @
            i += 4;
        } else if (codificado.substr(i, 5) === "-dot-") {
            decodificado += ".";               //el -dot- vuelve a ser un punto
            i += 5;
        } else if (codificado[i] === "_") {
            decodificado += " ";             // el guion bajo en un espacio
            i++;
        } else {
            decodificado += codificado[i]; 
            i++;
        }
    }
    return decodificado;  // y al final sale con los cambios correctos evitando errores
}
//para poder vincular con el javascript era necesario usar el .location.href y asi conseguir los datos que se obtuvieron en los html's, con esta funcion guardaremos los datos
function extraerDatosDeURL() {
    var url = document.location.href;
    var indiceParametros = url.indexOf("?");  //aqui abre el index 
    if (indiceParametros > -1) {
        var parametrosTexto = url.substring(indiceParametros + 1);  // selecciona indiceParametros
        var pares = parametrosTexto.split("&");
        for (var i = 0; i < pares.length; i++) {
            var par = pares[i].split("=");     //  el array se llama par y se separa con = 
            var clave = par[0];
            var valor = decodificarDato(par[1] || "");  // aqui es para ver si los datos ingresados estan en la posicion correcta o si es un espacio
            if (clave === "nombre") {
                usuarioNombre = valor;
            } else if (clave === "correo") {
                usuarioCorreo = valor;
            } else if (clave === "telefono") {
                usuarioTelefono = valor;
            } else if (clave === "contrasena") {
                usuarioContrasena = valor;
            } else if (clave === "bloqueado") {
                usuarioBloqueado = (valor === "true");
            } else if (clave === "intentos") {
                usuarioIntentosFallidos = parseInt(valor) || 0;  //los intentos fallidos seran contados solo en numeros y no en letras como: uno, dos...
            }
        }
        
        return true;
    }
    
    return false;
}

function crearURLConDatos(paginaDestino) {   // Como son URL's las que estamos usando para cambiar de html o en carpetas diferentes, e ahi el nombre de la funcion
    var datos = "";
    
    if (usuarioNombre) datos += "nombre=" + codificarDato(usuarioNombre) + "&";    // Asegurandonos que no hay problema con los datos ingresados
    if (usuarioCorreo) datos += "correo=" + codificarDato(usuarioCorreo) + "&";
    if (usuarioTelefono) datos += "telefono=" + codificarDato(usuarioTelefono) + "&";
    if (usuarioContrasena) datos += "contrasena=" + codificarDato(usuarioContrasena) + "&";
    
    datos += "bloqueado=" + usuarioBloqueado + "&";
    datos += "intentos=" + usuarioIntentosFallidos;
    
    return paginaDestino + "?" + datos;
}

// Con esta funcion podremos ver la contraseña oculta en el index (registro o Crear Cuenta)
function mostrarContrasenaRegistro() {
    var input = document.getElementById("contrasena");
    var span = document.getElementById("ojoContrasena");
    
    if (input && span) {
        if (input.type === "password") {
            input.type = "text";
            span.textContent = "👁️‍🗨️";
        } else {
            input.type = "password";
            span.textContent = "👁️";
        }
    }
}
// Con esta funcion podremos ver la contraseña oculta en inicio de sesion
function mostrarContrasenaLogin() {
    var input = document.getElementById("loginContrasena");
    var span = document.getElementById("ojoLogin");
    
    if (input && span) {
        if (input.type === "password") {
            input.type = "text";
            span.textContent = "👁️‍🗨️";
        } else {
            input.type = "password";
            span.textContent = "👁️";
        }
    }
}
// Con esta funcion podremos ver la contraseña oculta en Recuperar Contraseña
function mostrarContrasenaRecuperacion() {
    var input = document.getElementById("nuevaContrasena");
    var span = document.getElementById("ojoRecuperacion");
    
    if (input && span) {
        if (input.type === "password") {
            input.type = "text";
            span.textContent = "👁️‍🗨️";
        } else {
            input.type = "password";
            span.textContent = "👁️";
        }
    }
}


// Desde aqui comensamos a registrar en el index (Crear Cuenta) los datos 
function registrarUsuario() {
    // Obtener valores del formulario
    var nombre = document.getElementById("nombreCompleto").value;
    var correo = document.getElementById("correoUsuario").value;
    var telefono = document.getElementById("telefono").value;
    var contrasena = document.getElementById("contrasena").value;
    var mensajeElement = document.getElementById("mensaje");
    
    // En caso de que el nombre este mal
    if (!regexNombre.test(nombre)) {
        mensajeElement.textContent = "El Nombre Completo solo debe contener letras y espacios.";
        mensajeElement.style.color = "red";
        return false;
    }
    // En caso de que el correo (Nombre de Usuario) este mal
    if (!regexCorreo.test(correo)) {
        mensajeElement.textContent = "El Correo Electrónico no es válido.";
        mensajeElement.style.color = "red";
        return false;
    }
    // En caso de que el telefono este mal
    if (!regexTelefono.test(telefono)) {
        mensajeElement.textContent = "El Teléfono debe contener 8 dígitos y empezar con 6 o 7.";
        mensajeElement.style.color = "red";
        return false;
    }
    // En caso de que a la contraseña le falte algo
    if (!regexContrasena.test(contrasena)) {
        mensajeElement.textContent = "La contraseña debe tener al menos 6 caracteres, incluir mayúscula, minúscula, número y un carácter especial.";
        mensajeElement.style.color = "red";
        return false;
    }
    
    //Aqui se guardan los datos
    usuarioNombre = nombre;
    usuarioCorreo = correo;
    usuarioTelefono = telefono;
    usuarioContrasena = contrasena;
    usuarioBloqueado = false;
    usuarioIntentosFallidos = 0;
    //Luego si todo esta correcto nos mostrara el siguiente mensaje
    mensajeElement.textContent = "¡Cuenta creada con éxito para " + nombre + "! Ahora puedes iniciar sesión.";
    mensajeElement.style.color = "green";
    // Se actualiza el inicio de sesión con TODOS los datos
    var enlaceLogin = document.getElementById("enlaceLogin");
    if (enlaceLogin) {
        enlaceLogin.href = crearURLConDatos("pages/iniciosesion.html");  //directamente le manda los datos al iniciosesion.html
        enlaceLogin.textContent = "Inicia Sesión";
    }
    // para limpiar el formulario
    document.getElementById("registroForm").reset();
    return false;
}

// Desde aqui usamos la funcion para el inicio de sesion en el iniciosesion.html
function iniciarSesion() {
    //Obtenemos los valores del formulario 
    var correoInput = document.getElementById("loginCorreo").value;
    var contrasenaInput = document.getElementById("loginContrasena").value;
    var mensajeElement = document.getElementById("mensajeLogin");
    var recuperacionElement = document.getElementById("enlaceRecuperacion");
    // Verifica si el usuario es correcto, si no lo es mostrara lo siguiente
    if (usuarioCorreo === "") {
        mensajeElement.textContent = "No hay cuentas registradas. Por favor regístrate primero.";
        mensajeElement.style.color = "red";
        return false;
    }
    // Aqui usa la funcion para ver si el usuario ingresado esta bloqueado por los intentod fallidos
    if (usuarioBloqueado) {
        mensajeElement.textContent = "Cuenta bloqueada por intentos fallidos.";
        mensajeElement.style.color = "red";
        if (recuperacionElement) {
            recuperacionElement.style.display = "block";
            // si el usuario si esta bloqueado aparecera el siguiente enlace
            var enlaceRecuperar = document.getElementById("enlaceRecuperar");
            if (enlaceRecuperar) {
                enlaceRecuperar.href = crearURLConDatos("../pages/recuperacion.html"); //con direccion al Recuperacion de Contraseña que esta en recuperacion.html
            }
        }
        return false;
    }
    
    // verificamos que la contraseña y usuario son correctos
    if (correoInput === usuarioCorreo && contrasenaInput === usuarioContrasena) {
        //contados de intentos fallidos
        usuarioIntentosFallidos = 0;
        // si se ingreso bien saldra el siguiente mensaje
        mensajeElement.textContent = "Bienvenido al sistema, " + usuarioNombre;
        mensajeElement.style.color = "green";
        
        if (recuperacionElement) {
            recuperacionElement.style.display = "none";
        }
        document.getElementById("loginForm").reset();  //limpia es formulario
        
    } else {
        // si se ingresa mal el usuario y contraseña pasara lo siguiente
        usuarioIntentosFallidos = usuarioIntentosFallidos + 1; // se ira sumando
        if (usuarioIntentosFallidos >= 3) {   //si es igual o supera a los tres intentos
            usuarioBloqueado = true;
            mensajeElement.textContent = "Cuenta bloqueada por intentos fallidos.";  //la cuenta se bloquea
            if (recuperacionElement) {  // si se bloque aparece en un cuadro el enlace de recuperar contraseña
                recuperacionElement.style.display = "block";
                var enlaceRecuperar = document.getElementById("enlaceRecuperar");
                if (enlaceRecuperar) {
                    enlaceRecuperar.href = crearURLConDatos("../pages/recuperacion.html");  //nos manda al recuperacon.html
                }
            }
        } else {  //pero si no es igual ni mayor a tres entonces etra aqui
            var intentosRestantes = 3 - usuarioIntentosFallidos;
            mensajeElement.textContent = "Usuario o contraseña incorrectos. Intentos restantes: " + intentosRestantes; //nos mostrara el conteo hacia atras de las veces que podemos equivocarnos
            if (recuperacionElement) {
                recuperacionElement.style.display = "none";
            }
        }
        
        mensajeElement.style.color = "red";
    }
    
    return false;
}

// Desde aqui comenzamos con la funcion de Recuperar Contraseña en recuperacion.html
function recuperarContrasena() {
    // Obtenemos los valores del formulario
    var correoInput = document.getElementById("recuperacionCorreo").value;
    var nuevaContrasena = document.getElementById("nuevaContrasena").value;
    var mensajeElement = document.getElementById("mensajeRecuperacion");
    // validamos la nueva contraseña, si esta mal aparecera el siguiente mensaje
    if (!regexContrasena.test(nuevaContrasena)) {
        mensajeElement.textContent = "La nueva contraseña no cumple los requisitos (mayúscula, minúscula, número, caracter especial).";
        mensajeElement.style.color = "red";
        return false;
    }
    // Si el Usuario esta mal aparecera lo siguente
    if (usuarioCorreo === "") {
        mensajeElement.textContent = "No hay cuentas registradas.";
        mensajeElement.style.color = "red";
        return false;
    }
    // si el correo esta mal entonces aparecera lo siguiente 
    if (correoInput !== usuarioCorreo) {
        mensajeElement.textContent = "El correo ingresado no coincide con el usuario registrado.";
        mensajeElement.style.color = "red";
        return false;
    }
    
    //Aqui Aactualizamos la contraseña y desbloqueamos la cuenta
    usuarioContrasena = nuevaContrasena;
    usuarioBloqueado = false;
    usuarioIntentosFallidos = 0; // Se reinicia el contador de intentos Fallidos
    // Luego nos aparecera el siguiente mensaje
    mensajeElement.textContent = "Contraseña actualizada. Ahora puede iniciar sesión.";
    mensajeElement.style.color = "green";
    //Se actualiza el enlace que nos llevara al inicio de sesion 
    var enlaceVolverLogin = document.getElementById("enlaceVolverLogin");
    if (enlaceVolverLogin) {
        enlaceVolverLogin.href = crearURLConDatos("../pages/iniciosesion.html");
        enlaceVolverLogin.textContent = "Volver a Iniciar Sesión";
    }
    
    // Limpiar campo de nueva contraseña
    document.getElementById("nuevaContrasena").value = "";
    
    return false;
}

// para que la pagina ejecute correctamente
// primero extraeremos los datos que guardamos anteriormente 
var hayDatosEnURL = extraerDatosDeURL();

// Luego configuramos cada página según sus elementos
// Página de Crear Cuenta
var formularioRegistro = document.getElementById("registroForm");
if (formularioRegistro) {
    formularioRegistro.onsubmit = registrarUsuario;
    var ojoContrasena = document.getElementById("ojoContrasena");
    if (ojoContrasena) {
        ojoContrasena.onclick = mostrarContrasenaRegistro;
    }
    // Si llegamos aquí con datos, autocompletar campos
    if (hayDatosEnURL) {
        document.getElementById("nombreCompleto").value = usuarioNombre;
        document.getElementById("correoUsuario").value = usuarioCorreo;
        document.getElementById("telefono").value = usuarioTelefono;
    }
}
// Página de INICIO de SESION
var formularioLogin = document.getElementById("loginForm");
if (formularioLogin) {
    formularioLogin.onsubmit = iniciarSesion;
    var ojoLogin = document.getElementById("ojoLogin");
    if (ojoLogin) {
        ojoLogin.onclick = mostrarContrasenaLogin;
    }
    // Si la cuenta está bloqueada, muestra el enlace de recuperación
    if (usuarioBloqueado) {
        var recuperacionElement = document.getElementById("enlaceRecuperacion");
        if (recuperacionElement) {
            recuperacionElement.style.display = "block";
            var enlaceRecuperar = document.getElementById("enlaceRecuperar");
            if (enlaceRecuperar) {
                enlaceRecuperar.href = crearURLConDatos("../pages/recuperacion.html");
            }
        }
    }
    
}
// Página de RECUPERACIÓN
var formularioRecuperacion = document.getElementById("recuperacionForm");
if (formularioRecuperacion) {
    formularioRecuperacion.onsubmit = recuperarContrasena;
    var ojoRecuperacion = document.getElementById("ojoRecuperacion");
    if (ojoRecuperacion) {
        ojoRecuperacion.onclick = mostrarContrasenaRecuperacion;
    }
    //Como pidio solo la una nueva contraseña entonces puse autocompletar el correo en recuperación, con el ultimo correo que se uso
    document.getElementById("recuperacionCorreo").value = usuarioCorreo;
    // Actualiza enlace para volver al inicio de sesion
    var enlaceVolverLogin = document.getElementById("enlaceVolverLogin");
    if (enlaceVolverLogin) {
        enlaceVolverLogin.href = crearURLConDatos("../pages/iniciosesion.html");
    }
}
//FIN