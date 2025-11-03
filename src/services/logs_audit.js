import api from "./api";

const logsService = {
  listar: async () => {
    const response = await api.get("/logs");
    return response.data;
  }
};

export default logsService;
