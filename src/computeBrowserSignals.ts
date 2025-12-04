/**
 * @fileoverview Browser signal collection orchestration
 * 
 * This module coordinates the collection of various browser and device signals
 * from multiple sources (WebGL, WebGPU, audio, math, EME, performance timing, etc.)
 * and aggregates them into a unified BrowserSignals object.
 * 
 * All signal collection is performed locally in the browser without making any
 * network requests.
 * 
 * @module computeBrowserSignals
 */

import { BrowserSignals, PerformanceTimingInfo } from './types';
import { getWebGlBasics, getWebGlExtensions } from './sources/webgl';
import getWebGpuInfo from './sources/webgpu';
import getAudioFingerprint from './sources/audio';
import getMathFingerprint from './sources/math';
import getEmeInfo from './sources/eme';

/**
 * Safely attempts to access the global Navigator object.
 * 
 * @internal
 * @returns {Navigator | undefined} The Navigator object, or undefined if unavailable.
 */
function getNavigatorSafe(): Navigator | undefined {
  try {
    return typeof navigator !== 'undefined' ? navigator : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Safely attempts to access the global Window object.
 * 
 * @internal
 * @returns {Window | undefined} The Window object, or undefined if unavailable.
 */
function getWindowSafe(): Window | undefined {
  try {
    return typeof window !== 'undefined' ? window : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Measures the precision and baseline characteristics of the browser's
 * performance.now() implementation.
 * 
 * Different browsers and configurations have different timing precision levels,
 * which can serve as a fingerprinting signal. This function runs a large number
 * of iterations to detect the minimum timing resolution.
 * 
 * @internal
 * @returns {PerformanceTimingInfo | undefined} Timing precision data, or undefined if unavailable.
 */
function getPerformanceTiming(): PerformanceTimingInfo | undefined {
  try {
    const w = getWindowSafe() as any;
    if (!w?.performance?.now) return undefined;

    let min = 1;
    let max = 1;
    let prev = w.performance.now();
    let curr = prev;

    for (let i = 0; i < 50000; i++) {
      prev = curr;
      curr = w.performance.now();
      if (prev < curr) {
        const diff = curr - prev;
        if (diff > min) {
          if (diff < max) max = diff;
        } else if (diff < min) {
          max = min;
          min = diff;
        }
      }
    }

    return { precision: min, baseline: max };
  } catch {
    return undefined;
  }
}

/**
 * Collects the minimal set of browser signals required to build the anchor
 * used for the client-side visitorId. All work is performed locally in the
 * browser; no network calls are made.
 * 
 * This function coordinates the collection of signals from multiple sources:
 * - User-Agent, hardware concurrency, device memory from Navigator
 * - WebGL basics (version, vendor, renderer)
 * - WebGL extensions and parameters
 * - WebGPU capability information
 * - Audio fingerprint (or a lazy function to compute it)
 * - Math fingerprint based on floating-point operations
 * - EME (Encrypted Media Extensions) support
 * - Performance timing precision characteristics
 * 
 * @returns {Promise<BrowserSignals>} A promise that resolves to the collected browser signals.
 * 
 * @example
 * ```typescript
 * const signals = await computeBrowserSignals();
 * console.log('User-Agent:', signals.userAgent);
 * console.log('Hardware Concurrency:', signals.hardwareConcurrency);
 * ```
 * 
 * @public
 */
export async function computeBrowserSignals(): Promise<BrowserSignals> {
  const nav = getNavigatorSafe() as any;
  const basics = getWebGlBasics({ cache: {} });
  const extensions = getWebGlExtensions({ cache: {} });
  const webgpu = await getWebGpuInfo();
  const eme = await getEmeInfo();
  const mathFingerprint = getMathFingerprint();
  const audioFingerprint = getAudioFingerprint();
  const performanceTiming = getPerformanceTiming();

  let webgl: BrowserSignals['webgl'] = undefined;
  let webgExtensions: BrowserSignals['webgExtensions'] = undefined;

  if (typeof basics !== 'number') {
    webgl = {
      version: basics.version,
      vendor: basics.vendor,
      renderer: basics.renderer,
      vendorUnmasked: basics.vendorUnmasked,
      rendererUnmasked: basics.rendererUnmasked,
      shadingLanguageVersion: basics.shadingLanguageVersion,
      extensions: typeof extensions !== 'number' ? extensions.extensions ?? undefined : undefined,
    };
  }

  if (typeof extensions !== 'number') {
    webgExtensions = extensions;
  }

  const signals: BrowserSignals = {
    userAgent: nav?.userAgent || '',
    hardwareConcurrency: typeof nav?.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined,
    deviceMemory: typeof nav?.deviceMemory === 'number' ? nav.deviceMemory : undefined,
    webgl,
    webgExtensions,
    audioFingerprint,
    mathFingerprint,
    webgpu,
    eme,
    performanceTiming,
  };

  return signals;
}



