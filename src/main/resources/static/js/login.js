(() => {
  const qs = (s) => document.querySelector(s);
  const emailForm = qs('#form-email');
  const otpForm = qs('#form-otp');
  const sendOtpBtn = qs('#btn-send-otp');
  const resendOtpBtn = qs('#btn-resend-otp');
  const changeEmailBtn = qs('#btn-change-email');
  const otpMsg = qs('#otp-sent-msg');
  const otpCodeGroup = qs('#otp-code-group');
  const otpDev = qs('#otp-dev');

  const notify = (msg, ok = true) => {
    const el = document.createElement('div');
    el.className = `alert alert-${ok ? 'success' : 'danger'} mt-3`;
    el.textContent = msg;
    const parent = document.querySelector('#pane-email.show') ? emailForm : otpForm;
    parent.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  };

  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = qs('#email').value.trim();
      const password = qs('#password').value.trim();
      try {
        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, password})
        });
        const j = await r.json();
        if (j.estado) {
          notify('Sesión iniciada');
          setTimeout(() => location.href = '/dashboard', 800);
        } else {
          notify(j.mensaje || 'Error de autenticación', false);
        }
      } catch (err) {
        notify('Error conectando con el servidor', false);
      }
    });
  }

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
      const email = qs('#otp-email').value.trim();
      if (!email) {
        notify('Ingresa tu correo para enviar OTP', false);
        return;
      }
      try {
        const r = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email})
        });
        const j = await r.json();
        if (j.estado) {
          otpMsg.classList.remove('d-none');
          otpMsg.textContent = `Hemos enviado un código a ${email}`;
          otpCodeGroup.classList.remove('d-none');
          qs('#otp-code').setAttribute('required', 'true');
          qs('#otp-email').setAttribute('disabled', 'true');
          qs('#otp-actions').classList.remove('d-none');
          setTimeout(() => qs('#otp-code').focus(), 50);
          if (otpDev && j.salida && j.salida.devOtp) {
            otpDev.textContent = `Solo dev: ${j.salida.devOtp}`;
            otpDev.classList.remove('d-none');
          }
        } else {
          notify(j.mensaje || 'No se pudo enviar el OTP', false);
        }
      } catch (err) {
        notify('Error conectando con el servidor', false);
      }
    });
  }

  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', () => sendOtpBtn.click());
  }

  if (changeEmailBtn) {
    changeEmailBtn.addEventListener('click', () => {
      qs('#otp-email').removeAttribute('disabled');
      otpCodeGroup.classList.add('d-none');
      qs('#otp-code').removeAttribute('required');
      qs('#otp-code').value = '';
      qs('#otp-actions').classList.add('d-none');
      otpMsg.classList.add('d-none');
      otpDev && otpDev.classList.add('d-none');
      setTimeout(() => qs('#otp-email').focus(), 50);
    });
  }

  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = qs('#otp-email').value.trim();
      const otp = qs('#otp-code').value.trim();
      try {
        const r = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, otp})
        });
        const j = await r.json();
        if (j.estado) {
          notify('OTP verificado');
          setTimeout(() => location.href = '/dashboard', 800);
        } else {
          notify(j.mensaje || 'OTP inválido', false);
        }
      } catch (err) {
        notify('Error conectando con el servidor', false);
      }
    });
  }

  const openRegisterBtn = document.getElementById('link-register-open');
  const modalEl = document.getElementById('modal-register');
  const registerEmpresa = document.getElementById('btn-register-empresa');
  const registerConductor = document.getElementById('btn-register-conductor');
  const modalEmpresaEl = document.getElementById('modal-register-empresa');
  const modalConductorEl = document.getElementById('modal-register-conductor');
  if (openRegisterBtn && modalEl) {
    openRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });
  }
  if (registerEmpresa) {
    registerEmpresa.addEventListener('click', (e) => {
      e.preventDefault();
      const mSel = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      mSel.hide();
      const mEmp = new bootstrap.Modal(modalEmpresaEl);
      mEmp.show();
    });
  }
  if (registerConductor) {
    registerConductor.addEventListener('click', (e) => {
      e.preventDefault();
      const mSel = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      mSel.hide();
      const mCon = new bootstrap.Modal(modalConductorEl);
      mCon.show();
    });
  }

  const formEmp = document.getElementById('form-register-empresa');
  const formCon = document.getElementById('form-register-conductor');
  const simulateSubmit = async (form) => {
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Creando...';
    await new Promise(r => setTimeout(r, 800));
    btn.disabled = false;
    btn.textContent = 'Crear Cuenta';
    const alert = document.createElement('div');
    alert.className = 'alert alert-success mt-3';
    alert.textContent = 'Cuenta creada (simulado)';
    form.appendChild(alert);
    setTimeout(() => alert.remove(), 2500);
  };
  if (formEmp) {
    formEmp.addEventListener('submit', async (e) => {
      e.preventDefault();
      const p1 = document.getElementById('emp-pass').value;
      const p2 = document.getElementById('emp-pass2').value;
      if (p1 !== p2) { notify('Las contraseñas no coinciden', false); return; }
      await simulateSubmit(formEmp);
    });
  }
  if (formCon) {
    formCon.addEventListener('submit', async (e) => {
      e.preventDefault();
      const p1 = document.getElementById('con-pass').value;
      const p2 = document.getElementById('con-pass2').value;
      if (p1 !== p2) { notify('Las contraseñas no coinciden', false); return; }
      await simulateSubmit(formCon);
    });
  }
})();