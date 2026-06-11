import api from "./api";

const authService = {
  login: async ({ username, password }) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Credenciales incorrectas");
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
  getRol: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).rol : null;
  },
};

export default authService;