/**
 * @fileoverview Asynchronous utility functions
 * 
 * This module provides utilities for working with promises, async operations,
 * and event loop management. These utilities help coordinate timing-sensitive
 * operations and prevent blocking the browser's main thread.
 * 
 * @module utils/async
 */

/**
 * A value that may be either a promise or a direct value.
 * 
 * @template T
 * @typedef {Promise<T> | T} MaybePromise
 */
export type MaybePromise<T> = Promise<T> | T

/**
 * Creates a promise that resolves after a specified duration.
 * 
 * @template T
 * @param {number} durationMs - Duration to wait in milliseconds.
 * @param {T} [resolveWith] - Optional value to resolve the promise with.
 * @returns {Promise<T>} A promise that resolves after the specified duration.
 * 
 * @example
 * ```typescript
 * await wait(1000); // Wait 1 second
 * const value = await wait(500, 'done'); // Wait and resolve with 'done'
 * ```
 * 
 * @public
 */
export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith))
}

/**
 * Allows asynchronous actions and microtasks to happen by yielding control to the event loop.
 * 
 * Uses MessageChannel instead of setTimeout to avoid Chrome's throttling in background tabs.
 * 
 * @internal
 * @returns {Promise<void>} A promise that resolves after the event loop has been released.
 * 
 * @see https://stackoverflow.com/a/6032591/1118709
 * @see https://github.com/chromium/chromium/commit/0295dd09496330f3a9103ef7e543fa9b6050409b
 */
function releaseEventLoop(): Promise<void> {
  // Don't use setTimeout because Chrome throttles it in some cases causing very long agent execution:
  // https://stackoverflow.com/a/6032591/1118709
  // https://github.com/chromium/chromium/commit/0295dd09496330f3a9103ef7e543fa9b6050409b
  // Reusing a MessageChannel object gives no noticeable benefits
  return new Promise((resolve) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = () => resolve()
    channel.port2.postMessage(null)
  })
}

/**
 * Requests an idle callback if available, otherwise falls back to a timeout.
 * 
 * This function prefers using requestIdleCallback when available to schedule work
 * during browser idle periods. If not available, it falls back to a simple timeout.
 * 
 * @param {number} fallbackTimeout - Timeout duration to use if requestIdleCallback is unavailable.
 * @param {number} [deadlineTimeout=Infinity] - Maximum time to wait for an idle period.
 * @returns {Promise<void>} A promise that resolves when idle or after the timeout.
 * 
 * @example
 * ```typescript
 * await requestIdleCallbackIfAvailable(100, 1000);
 * // Work will be scheduled during idle time or after 100-1000ms
 * ```
 * 
 * @public
 * @see https://github.com/fingerprintjs/fingerprintjs/issues/683
 */
export function requestIdleCallbackIfAvailable(fallbackTimeout: number, deadlineTimeout = Infinity): Promise<void> {
  const { requestIdleCallback } = window
  if (requestIdleCallback) {
    // The function `requestIdleCallback` loses the binding to `window` here.
    // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
    // Therefore, an error can occur. `call(window,` prevents the error.
    return new Promise((resolve) => requestIdleCallback.call(window, () => resolve(), { timeout: deadlineTimeout }))
  } else {
    return wait(Math.min(fallbackTimeout, deadlineTimeout))
  }
}

/**
 * Type guard to check if a value is a Promise-like object.
 * 
 * @template T
 * @param {PromiseLike<T> | unknown} value - The value to check.
 * @returns {boolean} True if the value has a `then` method (is promise-like).
 * 
 * @example
 * ```typescript
 * const maybePromise = someFunction();
 * if (isPromise(maybePromise)) {
 *   await maybePromise;
 * }
 * ```
 * 
 * @public
 */
export function isPromise<T>(value: PromiseLike<T> | unknown): value is PromiseLike<T> {
  return !!value && typeof (value as PromiseLike<T>).then === 'function'
}

/**
 * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
 * Catches errors in both cases.
 *
 * This function is useful for accurate timing measurements. If you just use `await` on a synchronous
 * function, another microtask may run before the `await` returns control, leading to inaccurate timing.
 * 
 * @template TResult
 * @template TError
 * @param {() => MaybePromise<TResult>} action - The function to call (may be sync or async).
 * @param {Function} callback - Callback invoked with [true, result] on success or [false, error] on failure.
 * @returns {void}
 * 
 * @example
 * ```typescript
 * awaitIfAsync(
 *   () => someOperation(),
 *   (success, resultOrError) => {
 *     if (success) {
 *       console.log('Result:', resultOrError);
 *     } else {
 *       console.error('Error:', resultOrError);
 *     }
 *   }
 * );
 * ```
 * 
 * @public
 */
export function awaitIfAsync<TResult, TError = unknown>(
  action: () => MaybePromise<TResult>,
  callback: (...args: [success: true, result: TResult] | [success: false, error: TError]) => unknown,
): void {
  try {
    const returnedValue = action()
    if (isPromise(returnedValue)) {
      returnedValue.then(
        (result) => callback(true, result),
        (error: TError) => callback(false, error),
      )
    } else {
      callback(true, returnedValue)
    }
  } catch (error) {
    callback(false, error as TError)
  }
}

/**
 * Maps over an array with periodic breaks to allow the event loop to process other tasks.
 * 
 * If you run many synchronous tasks without using this function, the JS main loop will be busy
 * and asynchronous tasks (e.g. completing a network request, rendering the page) won't be able
 * to happen. This function allows running many synchronous tasks in a way that lets asynchronous
 * tasks run in the background.
 * 
 * @template T
 * @template U
 * @param {readonly T[]} items - The array to map over.
 * @param {(item: T, index: number) => U} callback - Function to call for each item.
 * @param {number} [loopReleaseInterval=16] - Milliseconds between event loop releases.
 * @returns {Promise<U[]>} A promise resolving to the mapped array.
 * 
 * @example
 * ```typescript
 * const results = await mapWithBreaks(
 *   largeArray,
 *   (item) => expensiveOperation(item),
 *   16
 * );
 * ```
 * 
 * @public
 */
export async function mapWithBreaks<T, U>(
  items: readonly T[],
  callback: (item: T, index: number) => U,
  loopReleaseInterval = 16,
): Promise<U[]> {
  const results = Array<U>(items.length)
  let lastLoopReleaseTime = Date.now()

  for (let i = 0; i < items.length; ++i) {
    results[i] = callback(items[i], i)

    const now = Date.now()
    if (now >= lastLoopReleaseTime + loopReleaseInterval) {
      lastLoopReleaseTime = now
      await releaseEventLoop()
    }
  }

  return results
}

/**
 * Makes the given promise never emit an unhandled promise rejection console warning.
 * The promise will still pass errors to the next promises in the chain.
 * Returns the input promise for convenience.
 *
 * Without this, a promise emits a console warning unless it has a `catch` listener,
 * even if the error is handled later in the promise chain.
 * 
 * @template T
 * @param {T} promise - The promise to suppress warnings for.
 * @returns {T} The same promise (for chaining).
 * 
 * @example
 * ```typescript
 * const promise = someAsyncOperation();
 * suppressUnhandledRejectionWarning(promise);
 * // Later...
 * promise.catch(error => handleError(error));
 * ```
 * 
 * @public
 */
export function suppressUnhandledRejectionWarning<T extends PromiseLike<unknown>>(promise: T): T {
  promise.then(undefined, () => undefined)
  return promise
}
