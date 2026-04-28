import { mockUsuarios } from "../mock/data";

const authService = {
  login: ({ username, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usuario = mockUsuarios.find(
          (u) => u.username === username && u.password === password
        );
        if (usuario) {
          localStorage.setItem("user", JSON.stringify(usuario));
          resolve(usuario);
        } else {
          reject(new Error("Credenciales incorrectas"));
        }
      }, 800);
    });
  },
  logout: () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem("user"),
  getRol: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).rol : null;
  },
};

export default authService;