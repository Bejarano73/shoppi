function iniciarInterfaz() {
    console.log("Iniciando interfaz de Registro ");
    spinner(false);
    btn_funciones_registro();
    $("#registrar").off().on("submit", function (e) {
        console.log("entras?");
        registrar(e);
    });
}

function btn_funciones_registro() {
    $("#iniciar_section_registro").off().click(function (e) {
        window.location.href = "/login";
    });

}
$("#btn_registrar_registro").on("click", function (e) {
    e.preventDefault();

    var Codigoempresarial = $("#codigoEmpresarial").val().trim();
    var identificacion = $("#identificacion").val().trim();
    var nombre = $("#nombre").val().trim();
    var apellido = $("#apellido").val().trim();
    var telefono = $("#telefono").val().trim();
    var correo = $("#correo").val().trim();
    var password = $("#password").val().trim();
    
    var mensaje = "";
    if (Codigoempresarial === "") {
        $("#codigoEmpresarial").addClass("errorInput");
        mensaje += "Por favor ingresa un código empresarial\n";
    }
    if (identificacion === "") {
        $("#identificacion").addClass("errorInput");
        mensaje += "Por favor ingresa su numero de identificacion\n";
    }
    if (nombre === "") {
        $("#nombre").addClass("errorInput");
        mensaje += "Por favor ingresa un nombre\n";
    }
    if (apellido === "") {
        $("#apellido").addClass("errorInput");
        mensaje += "Por favor ingresa un apellido\n";
    }
    if (telefono === "") {
        $("#telefono").addClass("errorInput");
        mensaje += "Por favor ingresa un telefono\n";
    }
    if (correo === "") {
        $("#correo").addClass("errorInput");
        mensaje += "Por favor ingresa un correo\n";
    }
    if (password === "") {
        $("#password").addClass("errorInput");
        mensaje += "Por favor ingresa una contraseña\n";
    }
    if (mensaje !==""){
    alert(mensaje);
    return false;
    }
});
function registrar(e) {
    e.preventDefault(); // Ponlo arriba para que sea lo primero que haga
    console.log("Entré a la función");

    const datosUsuario = {
        // MUCHO OJO: Las llaves deben ser IGUALES a las del DTO en Java
        // Si en Java es "nombres", aquí debe ser "nombres" (no "nombre")
        identificacion: $("#identificacion").val(),
        nombres: $("#nombre").val(), // <--- Verifica si en el DTO es 'nombres' o 'nombre'
        apellidos: $("#apellido").val(), // <--- Verifica si en el DTO es 'apellidos' o 'apellido'
        telefono: $("#telefono").val(),
        email: $("#correo").val(), // <--- Cambiado para que coincida con 'email' del DTO
        password: $("#password").val(),
        idciudad: 1, // Valores por defecto para probar
        idtipodocumento: 1
    };

    console.log("Datos a enviar:", datosUsuario);

    // ENVIAR DIRECTO (Sin el wrapper de DTO.transaccion)
    peticionesGlobales("/persona/registrar", datosUsuario, (salida, mensaje) => {
        console.log("Respuesta del servidor:", salida);
        alert("¡Guardado!");
    });
}

$(document).ready(function () {
    iniciarInterfaz();
});
