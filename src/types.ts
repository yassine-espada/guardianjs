/**
 * @fileoverview Type definitions for browser signals and related data structures
 * 
 * This module defines the core type interfaces used throughout GuardianJS for
 * representing browser and device signals collected during fingerprinting.
 * 
 * @module types
 */

import type { WebGlExtensionsPayload } from './sources/webgl';
import type { WebGpuInfo } from './sources/webgpu';
import type { EmeInfo } from './sources/eme';

/**
 * Information about the precision and baseline characteristics of the browser's
 * performance.now() implementation.
 * 
 * @interface PerformanceTimingInfo
 * @property {number} precision - The minimum detectable time difference (in milliseconds).
 * @property {number} baseline - The baseline time measurement (in milliseconds).
 * 
 * @example
 * ```typescript
 * const timing: PerformanceTimingInfo = {
 *   precision: 0.001,
 *   baseline: 0.005
 * };
 * ```
 */
export type PerformanceTimingInfo = {
  precision: number;
  baseline: number;
};

/**
 * Minimal browser signal bag required to compute the anchor-based visitorId.
 * This intentionally includes only the fields used by `computeAnchor`.
 * 
 * The BrowserSignals interface represents all the browser and device characteristics
 * collected by GuardianJS for fingerprinting purposes. These signals are combined
 * to create a unique visitor identifier.
 * 
 * @interface BrowserSignals
 * 
 * @example
 * ```typescript
 * const signals: BrowserSignals = {
 *   userAgent: 'Mozilla/5.0...',
 *   hardwareConcurrency: 8,
 *   deviceMemory: 8,
 *   webgl: { vendor: 'Apple', renderer: 'Apple M1' },
 *   // ... other signals
 * };
 * ```
 */
export interface BrowserSignals {
  /**
   * The browser's User-Agent string.
   * 
   * @example 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
   */
  userAgent: string;
  
  /**
   * Number of logical processors available to run threads.
   * Corresponds to `navigator.hardwareConcurrency`.
   * 
   * @example 8
   */
  hardwareConcurrency?: number;
  
  /**
   * Approximate amount of device memory in gigabytes.
   * Corresponds to `navigator.deviceMemory`.
   * 
   * @example 8
   */
  deviceMemory?: number;
  
  /**
   * WebGL context information including version, vendor, and renderer details.
   * 
   * @example
   * ```typescript
   * {
   *   version: 'WebGL 1.0',
   *   vendor: 'Apple',
   *   renderer: 'Apple M1',
   *   vendorUnmasked: 'Apple Inc.',
   *   rendererUnmasked: 'Apple M1 GPU',
   *   shadingLanguageVersion: 'WebGL GLSL ES 1.0',
   *   extensions: ['ANGLE_instanced_arrays', 'EXT_blend_minmax']
   * }
   * ```
   */
  webgl?:
    | {
        version?: string;
        vendor?: string;
        renderer?: string;
        vendorUnmasked?: string;
        rendererUnmasked?: string;
        shadingLanguageVersion?: string;
        extensions?: string[] | null;
      }
    | undefined;
  
  /**
   * Raw WebGL extensions payload, when successfully collected.
   * When collection fails, this may be `undefined`.
   * 
   * Contains detailed WebGL extension information including context attributes,
   * parameters, shader precisions, and supported extensions.
   */
  webgExtensions?: WebGlExtensionsPayload | undefined;
  
  /**
   * Audio fingerprint (or a lazy thunk resolving to one) as returned by the audio source.
   * 
   * Can be either a pre-computed number or a function that returns a promise
   * resolving to the audio fingerprint. The lazy pattern is used to avoid
   * blocking the main fingerprinting process.
   * 
   * @example 123.456 or (() => Promise.resolve(123.456))
   */
  audioFingerprint?: number | (() => Promise<number>);
  
  /**
   * Deterministic math fingerprint based on floating‑point quirks.
   * 
   * Contains results of various mathematical operations that can vary
   * slightly across different browsers and hardware due to floating-point
   * implementation differences.
   * 
   * @example
   * ```typescript
   * {
   *   acos: 1.4455870996659827,
   *   acosh: 709.889355822726,
   *   asin: 0.12343746096704435,
   *   // ... more math operations
   * }
   * ```
   */
  mathFingerprint?: Record<string, number>;
  
  /**
   * WebGPU capability snapshot.
   * 
   * Information about WebGPU support and adapter characteristics.
   * 
   * @example
   * ```typescript
   * {
   *   supported: true,
   *   isFallbackAdapter: false,
   *   vendor: 'apple',
   *   architecture: 'common-3',
   *   device: 'apple-m1'
   * }
   * ```
   */
  webgpu?: WebGpuInfo;
  
  /**
   * Widevine / EME (Encrypted Media Extensions) support info.
   * 
   * Indicates whether the browser supports DRM technologies like Widevine.
   * 
   * @example { widevineSupported: true }
   */
  eme?: EmeInfo;
  
  /**
   * Performance timing precision/baseline.
   * 
   * Characteristics of the browser's performance.now() implementation,
   * which can vary across browsers and privacy modes.
   * 
   * @example { precision: 0.001, baseline: 0.005 }
   */
  performanceTiming?: PerformanceTimingInfo;
}



