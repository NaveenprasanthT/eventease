import { apiRequest } from "./base/api";

const BASE_URL = "/api/event";

export const eventApi = {
  getAll: () => apiRequest<any[]>(BASE_URL, "GET"),
  getById: (id: string) => apiRequest<any>(`${BASE_URL}/${id}`, "GET"),
  create: (data: {
    title: string;
    description: string;
    date: string;
    location: string;
    maxAttendeeCount?: number | null;
  }) => apiRequest(BASE_URL, "POST", data),
  update: (id: string, data: any) =>
    apiRequest(`${BASE_URL}/${id}`, "PUT", data),
  remove: (id: string) => apiRequest(`${BASE_URL}/${id}`, "DELETE"),
  getAttendees: (id: string) => apiRequest(`${BASE_URL}/rsvp/${id}`),
};
