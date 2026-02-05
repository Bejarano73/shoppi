
function iniciarInterfaz() {
    console.log("Iniciando interfaz de login");
    if (typeof crearItemDocumento === 'function') {
        crearItemDocumento();
        btn_funciones_registro();
        boton_mostrar_password();

    }
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
        var otp = $(".otp").val();
        if (otp == "") {
            alert("Por favor, ingrese el código de recuperación.");
            return;
        }
    });
}

function boton_mostrar_password() {
    $('#togglePassword').click(function () {
        let input = $('#password');
        let type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).toggleClass('bi-eye').toggleClass('bi-eye-slash');
    });
}


// Inicializar cuando el DOM esté listo
$(document).ready(function () {
    iniciarInterfaz();
});