const API_BASE = import.meta.env.VITE_API_URL || "";

export interface CreateResponse {
  id: string;
  url: string;
  expiresAt: number;
  expiresIn: number;
}

export interface PasteResponse {
  id: string;
  content: string;
  delta: { ops: unknown[] };
  expiresAt: number;
  expiresIn: number;
}

export interface StatusResponse {
  used: number;
}

export interface ApiError {
  error: string;
  retryAfter?: number;
  nextAvailableAt?: number;
}

/**
 * Create a new paste.
 */
export async function createPaste(
  content: string,
  delta: object,
  turnstileToken: string
): Promise<CreateResponse> {
  const res = await fetch(`${API_BASE}/api/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, delta, turnstileToken }),
  });

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new ApiRequestError(err.error, res.status, err);
  }

  return res.json();
}

/**
 * Get a paste by ID.
 */
export async function getPaste(id: string): Promise<PasteResponse> {
  const res = await fetch(`${API_BASE}/api/${id}`);

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new ApiRequestError(err.error, res.status, err);
  }

  return res.json();
}

/**
 * Get system status (available slots).
 */
export async function getStatus(): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE}/api/status`);

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new ApiRequestError(err.error, res.status, err);
  }

  return res.json();
}

/**
 * Custom error class with status code and API error payload.
 */
export class ApiRequestError extends Error {
  status: number;
  data: ApiError;

  constructor(message: string, status: number, data: ApiError) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}
