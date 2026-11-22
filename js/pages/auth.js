/* ==========================================================================
   ROYAL GOLD & DIAMONDS - Authentication Page Controller (Login & Register)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'login';
  switchAuthTab(mode);

  setupLoginForm();
  setupRegisterForm();
});

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-box');
  const registerForm = document.getElementById('auth-register-box');
  const tabLoginBtn = document.getElementById('tab-btn-login');
  const tabRegisterBtn = document.getElementById('tab-btn-register');

  if (tab === 'register') {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabLoginBtn.classList.remove('active');
    tabRegisterBtn.classList.add('active');
  } else {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
  }
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('btn-login-submit');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

    const result = await window.authService.login(email, password);

    if (result.success) {
      window.showToast("Welcome Back", `Signed in as ${result.user.fullName}`, "success");
      setTimeout(() => {
        if (result.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 1000);
    } else {
      window.showToast("Authentication Failed", result.message, "danger");
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In to Royal Portal';
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const submitBtn = document.getElementById('btn-register-submit');

    if (password.length < 6) {
      window.showToast("Password Notice", "Please choose a password with at least 6 characters.", "warning");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Royal Account...';

    const result = await window.authService.register(fullName, email, password, phone);

    if (result.success) {
      window.showToast("Account Created", "Welcome to ROYAL GOLD & DIAMONDS Sovereign Circle!", "success");
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    } else {
      window.showToast("Registration Error", result.message, "danger");
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Create Royal Account';
    }
  });
}

// 1-Click Demo Credentials Autofill
function fillDemoCredentials(role) {
  switchAuthTab('login');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (role === 'admin') {
    emailInput.value = 'admin@royalgold.com';
    passwordInput.value = 'RoyalAdmin@2026';
    window.showToast("Admin Credentials Filled", "Click 'Sign In' or use credentials to access Admin Dashboard.", "info");
  } else {
    emailInput.value = 'customer@royalgold.com';
    passwordInput.value = 'Customer@2026';
    window.showToast("Customer Credentials Filled", "Click 'Sign In' to access Patron Account.", "info");
  }
}

// Toggle password visibility
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

window.switchAuthTab = switchAuthTab;
window.fillDemoCredentials = fillDemoCredentials;
window.togglePasswordVisibility = togglePasswordVisibility;
