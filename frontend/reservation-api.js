(function (window) {
  "use strict";

  const TOKEN_KEYS = ["access_token", "accessToken", "token"];

  function tokenFromStorage() {
    return TOKEN_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean) || "";
  }

  function apiBase() {
    return String(window.ADMIN_API_BASE_URL || window.localStorage.getItem("admin_api_base_url") || "").replace(/\/$/, "");
  }

  function loginPath() {
    return window.ADMIN_LOGIN_PATH || window.localStorage.getItem("admin_login_path") || "login.html";
  }

  function decodeJwtPayload(token) {
    try {
      const part = String(token).split(".")[1];
      if (!part) return null;
      const normalized = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
      const json = decodeURIComponent(atob(normalized).split("").map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(json);
    } catch (_error) { return null; }
  }

  function rolesFromPayload(payload) {
    const value = payload && (payload.roles || payload.role);
    return Array.isArray(value) ? value : [value];
  }

  function getSession() {
    const token = tokenFromStorage();
    const payload = token ? decodeJwtPayload(token) : null;
    const exp = payload && Object.prototype.hasOwnProperty.call(payload, "exp") ? Number(payload.exp) : null;
    return { token, payload, roles: rolesFromPayload(payload), valid: Boolean(payload && (!Object.prototype.hasOwnProperty.call(payload, "exp") || Number.isFinite(exp) && exp * 1000 > Date.now())) };
  }

  function messageForResponse(status) {
    return ({
      400: "Permintaan reservasi tidak valid. Periksa data dari backend.",
      401: "Sesi telah berakhir. Silakan masuk kembali.",
      403: "Sesi tidak memiliki izin untuk mengakses reservasi.",
      404: "Data atau endpoint reservasi tidak ditemukan.",
      429: "Terlalu banyak permintaan. Silakan tunggu sebentar lalu coba lagi.",
      500: "Layanan reservasi sedang bermasalah. Coba lagi nanti."
    })[status] || (status >= 500 ? "Layanan reservasi sedang bermasalah. Coba lagi nanti." : "Permintaan reservasi belum dapat diproses.");
  }

  async function request(path, options) {
    let response;
    try {
      response = await window.fetch(`${apiBase()}${path}`, Object.assign({ headers: { Accept: "application/json", Authorization: `Bearer ${tokenFromStorage()}` } }, options || {}));
    } catch (_error) {
      throw new Error("Server tidak dapat dihubungi. Periksa koneksi atau base URL API.");
    }
    let data = null;
    try { data = await response.json(); } catch (_error) {
      if (!response.ok) throw new Error(messageForResponse(response.status));
      if (response.status !== 204) throw new Error("Respons backend tidak berformat JSON yang dapat dibaca.");
    }
    if (!response.ok) {
      const backendMessage = data && (data.message || data.error);
      const error = new Error(messageForResponse(response.status));
      error.status = response.status;
      if (typeof backendMessage === "string" && response.status >= 400 && response.status !== 401 && response.status !== 403) error.message = backendMessage;
      throw error;
    }
    return data;
  }

  function listReservations() { return request("/reservation"); }

  function updateStatus(id, status) {
    if (!id || status === undefined || status === null || status === "") return Promise.reject(new Error("Reservasi atau status belum tersedia."));
    return request(`/reservation/${encodeURIComponent(String(id))}/status`, { method: "PATCH", headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${tokenFromStorage()}` }, body: JSON.stringify({ status }) });
  }

  window.WarkoponyReservationApi = { TOKEN_KEYS, getSession, loginPath, listReservations, updateStatus };
})(window);
