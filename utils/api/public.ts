import { apiRequest } from "./base/api";

const BASE_URL = "/api/public";

export const publicApi = {
  getAllEvents: () => apiRequest<any[]>(BASE_URL, "GET"),
  getById: (id: string) => apiRequest<any>(`${BASE_URL}/${id}`, "GET"),
};
