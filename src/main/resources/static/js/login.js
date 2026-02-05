
$(document).ready(function () {
    iniciarInterfaz();
});

function iniciarInterfaz() {
    console.log("Iniciando interfaz de login con jQuery");
    boton_mostrar_password();
    // btn_funciones();
    btn_funciones_registro();
    crearItemDocumento();
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



function btn_funciones() {
    // === Variables y Elementos ===
    const emailForm = $('#form-email');
    const otpForm = $('#form-otp');
    const sendOtpBtn = $('#btn-send-otp');
    const resendOtpBtn = $('#btn-resend-otp');
    const changeEmailBtn = $('#btn-change-email');
    const otpMsg = $('#otp-sent-msg');
    const otpCodeGroup = $('#otp-code-group');
    const otpDev = $('#otp-dev');
    const otpInput = $('#otp-code');
    const otpEmailInput = $('#otp-email');
    const otpActions = $('#otp-actions');

    // === Helpers ===
    const notify = (msg, ok = true) => {
        const el = $(`<div class="alert alert-${ok ? 'success' : 'danger'} mt-3">${msg}</div>`);
        const parent = $('#pane-email').hasClass('show') ? ($('#form-email').length ? $('#form-email') : emailForm) : otpForm;

        if (parent.length) {
            parent.append(el);
            setTimeout(() => el.remove(), 3500);
        }
    };

    // === Login Email/Pass ===
    if (emailForm.length) {
        emailForm.on('submit', async function (e) {
            e.preventDefault();
            const email = $('#email').val().trim();
            const password = $('#password').val().trim();

            if (typeof app !== 'undefined') app.spinner(true, "Autenticando...");

            try {
                const r = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const j = await r.json();
                if (j.estado) {
                    notify('Sesión iniciada');
                    setTimeout(() => location.href = '/dashboard', 800);
                } else {
                    if (typeof app !== 'undefined') app.spinner(false);
                    notify(j.mensaje || 'Error de autenticación', false);
                }
            } catch (err) {
                if (typeof app !== 'undefined') app.spinner(false);
                notify('Error conectando con el servidor', false);
            }
        });
    }

    // === OTP Flow ===
    if (sendOtpBtn.length) {
        sendOtpBtn.on('click', async function () {
            const email = otpEmailInput.val().trim();
            if (!email) {
                notify('Ingresa tu correo para enviar OTP', false);
                return;
            }
            if (typeof app !== 'undefined') app.spinner(true, "Enviando código...");

            try {
                const r = await fetch('/api/auth/request-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const j = await r.json();
                if (typeof app !== 'undefined') app.spinner(false);

                if (j.estado) {
                    otpMsg.removeClass('d-none').text(`Hemos enviado un código a ${email}`);
                    otpCodeGroup.removeClass('d-none');
                    otpInput.attr('required', true);
                    otpEmailInput.attr('disabled', true);
                    otpActions.removeClass('d-none');
                    setTimeout(() => otpInput.focus(), 50);
                    if (otpDev.length && j.salida && j.salida.devOtp) {
                        otpDev.text(`Solo dev: ${j.salida.devOtp}`).removeClass('d-none');
                    }
                } else {
                    notify(j.mensaje || 'No se pudo enviar el OTP', false);
                }
            } catch (err) {
                if (typeof app !== 'undefined') app.spinner(false);
                notify('Error conectando con el servidor', false);
            }
        });
    }

    if (resendOtpBtn.length) {
        resendOtpBtn.on('click', () => sendOtpBtn.click());
    }

    if (changeEmailBtn.length) {
        changeEmailBtn.on('click', function () {
            otpEmailInput.removeAttr('disabled');
            otpCodeGroup.addClass('d-none');
            otpInput.removeAttr('required').val('');
            otpActions.addClass('d-none');
            otpMsg.addClass('d-none');
            if (otpDev.length) otpDev.addClass('d-none');
            setTimeout(() => otpEmailInput.focus(), 50);
        });
    }

    if (otpForm.length) {
        otpForm.on('submit', async function (e) {
            e.preventDefault();
            const email = otpEmailInput.val().trim();
            const otp = otpInput.val().trim();

            if (typeof app !== 'undefined') app.spinner(true, "Verificando...");

            try {
                const r = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });
                const j = await r.json();
                if (j.estado) {
                    notify('OTP verificado');
                    setTimeout(() => location.href = '/dashboard', 800);
                } else {
                    if (typeof app !== 'undefined') app.spinner(false);
                    notify(j.mensaje || 'OTP inválido', false);
                }
            } catch (err) {
                if (typeof app !== 'undefined') app.spinner(false);
                notify('Error conectando con el servidor', false);
            }
        });
    }

    // === Registration Modals ===
    const openRegisterBtn = $('#btn_crear_cuenta'); // Corregido selector
    const modalEl = $('#modal-register');
    const registerEmpresa = $('#btn-register-empresa');
    const registerConductor = $('#btn-register-conductor');
    const modalEmpresaEl = $('#modal-register-empresa');
    const modalConductorEl = $('#modal-register-conductor');

    if (openRegisterBtn.length && modalEl.length) {
        openRegisterBtn.on('click', function (e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(modalEl[0]);
            modal.show();
        });
    }

    if (registerEmpresa.length) {
        registerEmpresa.on('click', function (e) {
            e.preventDefault();
            // Cerrar modal selección
            const mSel = bootstrap.Modal.getInstance(modalEl[0]);
            if (mSel) mSel.hide();

            // Abrir modal empresa
            const mEmp = new bootstrap.Modal(modalEmpresaEl[0]);
            mEmp.show();
        });
    }

    if (registerConductor.length) {
        registerConductor.on('click', function (e) {
            e.preventDefault();
            // Cerrar modal selección
            const mSel = bootstrap.Modal.getInstance(modalEl[0]);
            if (mSel) mSel.hide();

            // Abrir modal conductor
            const mCon = new bootstrap.Modal(modalConductorEl[0]);
            mCon.show();
        });
    }



    // === Simulación de Registro ===
    const formEmp = $('#form-register-empresa');
    const formCon = $('#form-register-conductor');

    const simulateSubmit = async (form) => {
        const btn = form.find('button[type="submit"]');
        const originalText = btn.text();
        btn.prop('disabled', true).text('Creando...');

        if (typeof app !== 'undefined') app.spinner(true, "Registrando...");

        await new Promise(r => setTimeout(r, 1500));

        if (typeof app !== 'undefined') app.spinner(false);

        btn.prop('disabled', false).text(originalText);

        const alert = $('<div class="alert alert-success mt-3">Cuenta creada con éxito (simulado)</div>');
        form.append(alert);

        setTimeout(() => {
            alert.remove();
            // Cerrar modal
            const modalInstance = bootstrap.Modal.getInstance(form.closest('.modal')[0]);
            if (modalInstance) modalInstance.hide();
        }, 2000);
    };

    if (formEmp.length) {
        formEmp.on('submit', async function (e) {
            e.preventDefault();
            const p1 = $('#emp-pass').val();
            const p2 = $('#emp-pass2').val();
            if (p1 !== p2) {
                notify('Las contraseñas no coinciden', false);
                return;
            }
            await simulateSubmit(formEmp);
        });
    }

    if (formCon.length) {
        formCon.on('submit', async function (e) {
            e.preventDefault();
            const p1 = $('#con-pass').val();
            const p2 = $('#con-pass2').val();
            if (p1 !== p2) {
                notify('Las contraseñas no coinciden', false);
                return;
            }
            await simulateSubmit(formCon);
        });
    }
}
