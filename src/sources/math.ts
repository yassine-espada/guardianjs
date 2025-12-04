/**
 * @fileoverview Math fingerprinting based on floating-point operation quirks
 * 
 * This module generates a deterministic fingerprint by executing various mathematical
 * operations and capturing their results. Different browsers and hardware platforms
 * may produce slightly different results due to variations in floating-point
 * implementations, compiler optimizations, and hardware architecture.
 * 
 * These variations are typically very small but measurable, making them useful
 * for device fingerprinting.
 * 
 * @module sources/math
 * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
 */

const M = Math // To reduce the minified code size
const fallbackFn = () => 0

/**
 * Generates a math fingerprint by executing various mathematical operations
 * and recording their results.
 * 
 * The fingerprint includes results from:
 * - Trigonometric functions (sin, cos, tan, asin, acos, atan)
 * - Hyperbolic functions (sinh, cosh, tanh, asinh, acosh, atanh)
 * - Exponential and logarithmic functions (exp, expm1, log1p)
 * - Power functions
 * - Both native implementations and polyfill implementations
 * 
 * Different browsers and hardware may produce slightly different floating-point
 * results due to implementation details, making this useful for fingerprinting.
 * 
 * @returns {Record<string, number>} An object mapping operation names to their numerical results.
 * 
 * @example
 * ```typescript
 * const fingerprint = getMathFingerprint();
 * // {
 * //   acos: 1.4455870996659827,
 * //   acosh: 709.889355822726,
 * //   asin: 0.12343746096704435,
 * //   ...
 * // }
 * ```
 * 
 * @public
 */
export default function getMathFingerprint(): Record<string, number> {
  // Native operations
  const acos = M.acos || fallbackFn
  const acosh = M.acosh || fallbackFn
  const asin = M.asin || fallbackFn
  const asinh = M.asinh || fallbackFn
  const atanh = M.atanh || fallbackFn
  const atan = M.atan || fallbackFn
  const sin = M.sin || fallbackFn
  const sinh = M.sinh || fallbackFn
  const cos = M.cos || fallbackFn
  const cosh = M.cosh || fallbackFn
  const tan = M.tan || fallbackFn
  const tanh = M.tanh || fallbackFn
  const exp = M.exp || fallbackFn
  const expm1 = M.expm1 || fallbackFn
  const log1p = M.log1p || fallbackFn

  // Operation polyfills
  const powPI = (value: number) => M.pow(M.PI, value)
  const acoshPf = (value: number) => M.log(value + M.sqrt(value * value - 1))
  const asinhPf = (value: number) => M.log(value + M.sqrt(value * value + 1))
  const atanhPf = (value: number) => M.log((1 + value) / (1 - value)) / 2
  const sinhPf = (value: number) => M.exp(value) - 1 / M.exp(value) / 2
  const coshPf = (value: number) => (M.exp(value) + 1 / M.exp(value)) / 2
  const expm1Pf = (value: number) => M.exp(value) - 1
  const tanhPf = (value: number) => (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1)
  const log1pPf = (value: number) => M.log(1 + value)

  // Note: constant values are empirical
  return {
    acos: acos(0.123124234234234242),
    acosh: acosh(1e308),
    acoshPf: acoshPf(1e154), // 1e308 will not work for polyfill
    asin: asin(0.123124234234234242),
    asinh: asinh(1),
    asinhPf: asinhPf(1),
    atanh: atanh(0.5),
    atanhPf: atanhPf(0.5),
    atan: atan(0.5),
    sin: sin(-1e300),
    sinh: sinh(1),
    sinhPf: sinhPf(1),
    cos: cos(10.000000000123),
    cosh: cosh(1),
    coshPf: coshPf(1),
    tan: tan(-1e300),
    tanh: tanh(1),
    tanhPf: tanhPf(1),
    exp: exp(1),
    expm1: expm1(1),
    expm1Pf: expm1Pf(1),
    log1p: log1p(10),
    log1pPf: log1pPf(10),
    powPI: powPI(-100),
  }
}
