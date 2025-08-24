export function jsonData(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

export function badRequest(message: string) {
  return jsonData({ error: message }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return jsonData({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return jsonData({ error: message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return jsonData({ error: message }, { status: 404 });
}
