import { apiRequest } from "./base/api";

const BASE_URL = "/api/dashboard";

export const dashboardApi = {
  getCards: () => apiRequest<any[]>(BASE_URL, "GET"),
};
