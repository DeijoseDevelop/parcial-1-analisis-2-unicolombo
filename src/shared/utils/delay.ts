/**
 * Simulates network latency for mock repositories.
 * Returns a promise that resolves with the given data after `ms` milliseconds.
 */
export function delay<T>(data: T, ms = 400): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
