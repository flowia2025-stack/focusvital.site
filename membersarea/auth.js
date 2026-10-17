/* Login da área de membros (receita da DOCUMENTACAO-API.md, Cenário B).
   Valida a sessão ao carregar e só então dispara "member-ready", que libera o app.js. */
const API_URL = "https://stack-membros-api.hycgbr.easypanel.host";
const API_KEY = "AAAHimr6C4s7XR5FUaTxfs29p1FiRZ1O";
const MAIN_PRODUCT_ID = "8685127"; // Brighter Days: 150+ Activities for Seniors
const TOKEN_KEY = "ma_token";

/* A API responde em português; a página é em inglês. A mensagem da tela sai do status HTTP,
   e o texto original da API vai para o console (ajuda no suporte). */
const LOGIN_MESSAGES = {
  404: "We couldn't find a purchase with this email. Please use the email you used to buy Brighter Days.",
  403: "This email doesn't have access to Brighter Days. Please use the email you used to buy it.",
  429: "Too many attempts. Please wait a moment and try again.",
};
function loginMessage(status, d) {
  if (d && d.error) console.warn("[login] " + status + ": " + d.error);
  return LOGIN_MESSAGES[status] || "We couldn't sign you in. Please try again.";
}

function api(path, body) {
  return fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": API_KEY },
    body: JSON.stringify(body),
  });
}

const viewLogin = document.getElementById("viewLogin");
const appRoot   = document.getElementById("appRoot");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginError = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");
const loginBtnLabel = document.getElementById("loginBtnLabel");
const bootLoader = document.getElementById("loader");

function setBusy(busy) {
  loginBtn.disabled = busy;
  loginBtnLabel.textContent = busy ? "Signing in…" : "Sign In";
}

function showApp(user) {
  bootLoader.hidden = true;
  viewLogin.hidden = true;
  appRoot.style.display = "";
  // 'user.products' é a lista de IDs que a pessoa possui: o app.js usa para liberar ou ofertar cada produto secundário.
  window.dispatchEvent(new CustomEvent("member-ready", { detail: { products: user.products } }));
}

function showLogin(errorMessage) {
  bootLoader.hidden = true;
  appRoot.style.display = "none";
  viewLogin.hidden = false;
  if (errorMessage) { loginError.textContent = errorMessage; loginError.hidden = false; }
}

function logout() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
  location.reload();
}

// --- ao carregar a página: valida sessão existente, se houver ---
(function init() {
  let token;
  try { token = localStorage.getItem(TOKEN_KEY); } catch (e) {}
  if (!token) { showLogin(); return; }

  bootLoader.hidden = false;
  api("/sessao", { token, mainProductId: MAIN_PRODUCT_ID })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => showApp(d.user))
    .catch(() => {
      try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
      showLogin();
    });
})();

// --- envio do formulário de login ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  if (!email) return;
  loginError.hidden = true;
  setBusy(true);

  api("/login", { email, mainProductId: MAIN_PRODUCT_ID })
    .then((r) => r.json().then((d) => ({ ok: r.ok, status: r.status, d })))
    .then(({ ok, status, d }) => {
      if (!ok) { setBusy(false); loginError.textContent = loginMessage(status, d); loginError.hidden = false; return; }
      try { localStorage.setItem(TOKEN_KEY, d.token); } catch (e) {}
      showApp(d.user);
    })
    .catch(() => { setBusy(false); loginError.textContent = "Connection error. Please check your internet and try again."; loginError.hidden = false; });
});

document.getElementById("logoutBtn").addEventListener("click", logout);
