function iniciarInterfaz() {
    abrirmodal();
    alerta();
}

function abrirmodal() {
    $(".seleccionar-plan").click(function () {
        $("#planModal").modal("show");
    });
}

function alerta() { 
    
    $("#btn_planes").off("click").on("click", function(e) {
    
        e.preventDefault(); // evita envío del formulario

        var nombre = $("#nombre_planes").val().trim();
        var email = $("#email_planes").val().trim();
        var mensaje = $("#mensaje_planes").val().trim();
        // Validación de campos obligatorios
        if (nombre === "" || email === "") {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }
        
    });
}


$(document).ready(function () {
    iniciarInterfaz();
});
