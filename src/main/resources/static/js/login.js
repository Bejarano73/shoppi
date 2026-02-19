
function iniciar_Interfaz() {
//    $("#form_global_menu").addClass("d-none");
    $('#togglePassword').click(function () {
        let input = $('#password');
        let type = input.prop('type') === 'password' ? 'text' : 'password';
        input.prop('type', type);
        $(this).toggleClass('bi-eye bi-eye-slash');
    });
    $("#recuperacion_password").click(function (e) {
        $("#modal_recuperar_password").modal("show");
    });
}

$(document).ready(function () {
    iniciar_Interfaz();
});
