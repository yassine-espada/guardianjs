/**
 * @fileoverview Lightweight, deterministic hashing utilities for use in the browser
 * 
 * These functions are intentionally simple and dependency‑free so that the
 * open‑source GuardianJS build can run in any modern browser without relying
 * on Node's `crypto` module or Web Crypto APIs.
 * 
 * The hashing algorithm used here is non-cryptographic but provides sufficient
 * collision resistance for fingerprinting purposes. For production-grade security,
 * consider using Guardian Pro which employs server-side cryptographic hashing.
 * 
 * @module hash
 */

/**
 * Canonicalizes an object/array into JSON with sorted keys to guarantee
 * stable hashing across runtimes.
 * 
 * This function ensures that objects with the same properties but in different
 * orders will produce the same JSON string, which is essential for deterministic
 * hashing.
 * 
 * @param {unknown} value - The value to canonicalize (object, array, primitive).
 * @returns {string} A JSON string with deterministically ordered keys.
 * 
 * @example
 * ```typescript
 * const obj1 = { b: 2, a: 1 };
 * const obj2 = { a: 1, b: 2 };
 * canonicalize(obj1) === canonicalize(obj2); // true
 * ```
 * 
 * @public
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(value, replacer);
}

/**
 * JSON replacer function that sorts object keys to ensure deterministic ordering.
 * 
 * @internal
 * @param {string} _key - The key (unused).
 * @param {any} val - The value being stringified.
 * @returns {any} The value with sorted keys if it's an object.
 */
function replacer(_key: string, val: any): any {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return val;
  const sorted: Record<string, any> = {};
  for (const k of Object.keys(val).sort()) {
    sorted[k] = val[k];
  }
  return sorted;
}

/**
 * Normalizes a string for case‑insensitive comparisons and hashing.
 * 
 * This function trims whitespace and converts the string to lowercase,
 * returning undefined if the result is empty or the input is null/undefined.
 * 
 * @param {string | null | undefined} input - The string to normalize.
 * @returns {string | undefined} The normalized string, or undefined if empty/null.
 * 
 * @example
 * ```typescript
 * normalizeString('  Apple  '); // 'apple'
 * normalizeString(''); // undefined
 * normalizeString(null); // undefined
 * ```
 * 
 * @public
 */
export function normalizeString(input?: string | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim().toLowerCase();
  return trimmed || undefined;
}

/**
 * Simple, non‑cryptographic but stable hash function.
 *
 * Produces a 16‑character hexadecimal string (64 bits of output) that is
 * sufficient for the open‑source client identifier. The Pro Guardian backend
 * uses stronger server‑side cryptography and additional signals.
 * 
 * This implementation uses a variant of the MurmurHash algorithm, which provides
 * good distribution and low collision rates for non-cryptographic purposes.
 * 
 * **Important:** This hash is not suitable for security-critical applications
 * where resistance to intentional collisions is required.
 * 
 * @param {unknown} value - The value to hash (will be canonicalized if not a string).
 * @returns {string} A 16-character hexadecimal hash string.
 * 
 * @example
 * ```typescript
 * const hash1 = stableHash({ a: 1, b: 2 });
 * const hash2 = stableHash({ b: 2, a: 1 });
 * hash1 === hash2; // true (deterministic)
 * 
 * stableHash('hello'); // '9595c9df90075148'
 * ```
 * 
 * @public
 */
export function stableHash(value: unknown): string {
  const json = typeof value === 'string' ? value : canonicalize(value);
  let h1 = 0xdeadbeef ^ json.length;
  let h2 = 0x41c6ce57 ^ json.length;

  for (let i = 0; i < json.length; i++) {
    const ch = json.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hi = (h1 >>> 0).toString(16).padStart(8, '0');
  const lo = (h2 >>> 0).toString(16).padStart(8, '0');
  return hi + lo;
}



