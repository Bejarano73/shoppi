
function iniciarInterfaz() {
    console.log("Iniciando interfaz de login");
    if (typeof crearItemDocumento === 'function') {
        crearItemDocumento();
        btn_funciones_registro();
        boton_mostrar_password();

    }
    $("#form-email").on("submit", function (e) {
        loggeo(e);
    });
}

function btn_funciones_registro() {
    $("#btn_crear_cuenta").click(function (e) {
        e.preventDefault();
        $("#elige_tipo_cuenta").removeClass("d-none");
        $("#pane-email").addClass("d-none");
    });
    $("#return_panel_email").click(function (e) {
        e.preventDefault();
        $("#elige_tipo_cuenta").addClass("d-none");
        $("#pane-email").removeClass("d-none");
    });
    $(".btn-toggle-cootras").click(function (e) {
        e.preventDefault();
        $("#elige_tipo_cuenta, #create_empresa").addClass("d-none");
        $("#registro_empresa").removeClass("d-none");
        let id = $(this).data("id");
        if (id == 1) {
            $("#text_cuenta").text("Crear cuenta de Empresa");

        } else if (id == 2) {
            $("#text_cuenta").text("Crear cuenta de Cliente");

        } else if (id == 3) {
            $("#text_cuenta").text("Crear cuenta de Conductor");

        } else if (id == 4) {
            $("#text_cuenta").text("Crear cuenta de Vehículo");

        }
    });
    $("#btn_ingresar_header").click(function (e) {
        e.preventDefault();
        $("#elige_tipo_cuenta").addClass("d-none");
        $("#pane-email").removeClass("d-none");
    });
    $("#return_opciones").click(function (e) {
        e.preventDefault();
        $("#registro_empresa").addClass("d-none");
        $("#create_empresa, #elige_tipo_cuenta").removeClass("d-none");
    });



    $("#recuperacion_password").off().click(function (e) {
        e.preventDefault();
        $("#modal_recuperar_password").modal("show");
    });
    $("#btn-send-otp").off().click(function (e) {
        e.preventDefault();
        $("#modal_verificar_otp").modal("show");
    });

    $("#btn_confirmar_otp").off().click(function (e) {
        e.preventDefault();
        var otp = $(".verificar").map(function () {
            return $(this).val();
        }).get().join('');
        if (otp == "") {
            alert("Por favor, ingrese el código de recuperación.");
            return;
        }
    });
    $("#btn-send-otp").off().click(function (e) {
        e.preventDefault();
        var otp = $("#otp-email").map(function () {
            return $(this).val();
        }).get().join('');
        if (otp == "") {
            alert("Por favor, ingrese su correo electrónico.");
            return;
        }
    });

    $('#modal_recuperar_password').on('shown.bs.modal', function () {
        $(this).find('input').val('');
    });
    // verificacion de otp
    $('#modal_verificar_otp').on('shown.bs.modal', function () {
        $(this).find('input').val('');
    });
    $('.otp_code').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, ''); // solo números
        if (this.value.length === 1) {
            $(this).next('.otp_code').focus();
        }
    });

    $('.otp_code').on('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '') {
            $(this).prev('.otp_code').focus();
        }
    });

}

function boton_mostrar_password() {
    $('#togglePassword').off().click(function () {
        let input = $('#password');
        let type = input.prop('type') === 'password' ? 'text' : 'password';
        input.prop('type', type);
        $(this).toggleClass('bi-eye bi-eye-slash');
    });

}

function loggeo(e) {
    e.preventDefault(); // Detenemos la recarga de la página
    // Capturamos los valores de los inputs de tu HTML
    const correo = $("#email").val();
    const clave = $("#password").val();
    // Validación básica antes de enviar
    if (!correo || !clave) {
        alert("Por favor, ingrese su correo y contraseña.", "Campos vacíos", true);
        return;
    }
    // Armamos el objeto con el DTO
    const dataLogin = DTO.credenciales(correo, clave);
    // Enviamos usando la función reutilizable
    peticionPro("/api/auth/login", dataLogin, function (salida) {
        // 'salida' es lo que devuelve el backend (ej. un Token o datos del Usuario)
        // Si llegamos aquí, peticionPro ya mostró tu alerta de "¡Logrado!"
//        window.location.href = "/dashboard";
        console.log("logramos?");
    });
}

// Inicializar cuando el DOM esté listo
$(document).ready(function () {
    iniciarInterfaz();
});
