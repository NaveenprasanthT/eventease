export async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
  body?: unknown,
  headers: HeadersInit = {}
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store", // for fresh data
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}
