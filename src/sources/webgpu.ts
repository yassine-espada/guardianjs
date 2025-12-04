/**
 * @fileoverview WebGPU capability detection
 * 
 * This module detects WebGPU support and collects information about the
 * GPU adapter. WebGPU is a modern graphics API that provides low-level,
 * high-performance access to GPU hardware.
 * 
 * @module sources/webgpu
 * @see https://www.w3.org/TR/webgpu/
 */

/**
 * Information about WebGPU support and adapter characteristics.
 * 
 * @typedef {Object} WebGpuInfo
 * @property {boolean} supported - Whether WebGPU is supported in the browser.
 * @property {boolean} [isFallbackAdapter] - Whether the adapter is a software fallback.
 * @property {string} [vendor] - GPU vendor identifier (e.g., 'apple', 'nvidia', 'amd').
 * @property {string} [architecture] - GPU architecture identifier.
 * @property {string} [device] - Specific device identifier.
 * 
 * @example
 * ```typescript
 * const info: WebGpuInfo = {
 *   supported: true,
 *   isFallbackAdapter: false,
 *   vendor: 'apple',
 *   architecture: 'common-3',
 *   device: 'apple-m1'
 * };
 * ```
 */
export type WebGpuInfo = {
  supported: boolean;
  isFallbackAdapter?: boolean;
  vendor?: string;
  architecture?: string;
  device?: string;
};

/**
 * Detects WebGPU support and collects adapter information.
 * 
 * This function attempts to:
 * 1. Check if the WebGPU API is available (`navigator.gpu`)
 * 2. Request a GPU adapter
 * 3. Extract adapter information (vendor, architecture, device)
 * 
 * If WebGPU is not supported or the adapter cannot be obtained, the function
 * returns minimal information indicating lack of support.
 * 
 * @returns {Promise<WebGpuInfo>} A promise resolving to WebGPU capability information.
 * 
 * @example
 * ```typescript
 * const webgpuInfo = await getWebGpuInfo();
 * if (webgpuInfo.supported) {
 *   console.log('WebGPU vendor:', webgpuInfo.vendor);
 *   console.log('Is fallback:', webgpuInfo.isFallbackAdapter);
 * }
 * ```
 * 
 * @public
 */
export default async function getWebGpuInfo(): Promise<WebGpuInfo> {
  try {
    const nav: any = navigator as any;
    const gpu = nav?.gpu;
    if (!gpu || typeof gpu.requestAdapter !== "function") {
      return { supported: false };
    }

    const adapter: any = await gpu.requestAdapter();
    if (!adapter) {
      return { supported: true, isFallbackAdapter: true };
    }

    const info = (adapter as any).adapterInfo || {};
    return {
      supported: true,
      isFallbackAdapter: (adapter as any).isFallbackAdapter === true,
      vendor: typeof info.vendor === "string" ? info.vendor : undefined,
      architecture:
        typeof info.architecture === "string" ? info.architecture : undefined,
      device: typeof info.device === "string" ? info.device : undefined,
    };
  } catch {
    return { supported: false };
  }
}
