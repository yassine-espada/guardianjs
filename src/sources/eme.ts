/**
 * @fileoverview EME (Encrypted Media Extensions) detection
 * 
 * This module detects support for Encrypted Media Extensions (EME), specifically
 * Widevine DRM technology. EME support can vary based on browser, platform, and
 * security context.
 * 
 * The detection is designed to be non-blocking and fail gracefully in restricted
 * environments such as:
 * - iframes with strict Permissions Policy
 * - non-secure contexts (HTTP)
 * - browsers with privacy extensions
 * - systems with disabled Content Decryption Modules (CDM)
 * 
 * @module sources/eme
 */

/**
 * Information about EME (Encrypted Media Extensions) support.
 * 
 * @typedef {Object} EmeInfo
 * @property {boolean} [widevineSupported] - Whether Widevine DRM is supported.
 *   Undefined if detection was not possible or inconclusive.
 * 
 * @example
 * ```typescript
 * const emeInfo: EmeInfo = { widevineSupported: true };
 * const unknownInfo: EmeInfo = {}; // Detection failed or unavailable
 * ```
 */
export type EmeInfo = { widevineSupported?: boolean };

/**
 * Detects EME (Encrypted Media Extensions) support for Widevine.
 * Returns `{ widevineSupported: boolean }` when a definitive answer is available,
 * otherwise returns `{}`.
 *
 * This function attempts to request access to the Widevine media key system.
 * It handles various edge cases:
 * - Checks Permissions Policy to avoid probing when EME is disabled
 * - Skips detection in non-secure contexts (HTTP)
 * - Gracefully handles environments where EME APIs are unavailable
 * 
 * Notes:
 * - Some environments (iframes with Permissions Policy, privacy extensions, disabled CDM)
 *   can cause the EME probe to be slow or unreliable. The caller wraps this with a soft
 *   timeout to avoid blocking overall signal collection.
 * 
 * @returns {Promise<EmeInfo>} A promise resolving to EME support information.
 * 
 * @example
 * ```typescript
 * const emeInfo = await getEmeInfo();
 * if (emeInfo.widevineSupported !== undefined) {
 *   console.log('Widevine supported:', emeInfo.widevineSupported);
 * } else {
 *   console.log('EME detection unavailable');
 * }
 * ```
 * 
 * @public
 */
export default async function getEmeInfo(): Promise<EmeInfo> {
  try {
    // If the page is not allowed to use EME by Permissions Policy, short-circuit.
    try {
      const doc: any = document as any;
      const policy = (doc && (doc.permissionsPolicy || doc.featurePolicy)) as any;
      if (policy && typeof policy.allowsFeature === "function") {
        if (policy.allowsFeature && policy.allowsFeature("encrypted-media") === false) {
          return {};
        }
      }
    } catch {}
    // Non-secure contexts and some embedded contexts may not reliably answer; avoid probing.
    try {
      const w: any = window as any;
      if (typeof w?.isSecureContext === "boolean" && w.isSecureContext === false) {
        return {};
      }
    } catch {}

    const nav: any = navigator as any;
    const req = nav?.requestMediaKeySystemAccess;
    if (typeof req !== "function") return {};
    const keySystem = "com.widevine.alpha";
    const config = [
      {
        initDataTypes: ["cenc"],
        audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
        videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
      },
    ];
    try {
      await nav.requestMediaKeySystemAccess(keySystem, config as any);
      return { widevineSupported: true };
    } catch {
      return { widevineSupported: false };
    }
  } catch {
    return {};
  }
}


