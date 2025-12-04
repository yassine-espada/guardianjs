/**
 * @fileoverview Ambient DOM type augmentations for GuardianJS
 * 
 * This module extends global DOM interfaces to include vendor-prefixed properties
 * and non-standard APIs that may be present in some browsers. These type augmentations
 * allow TypeScript to recognize browser-specific APIs without causing compilation errors.
 * 
 * No runtime code is executed by this module - it only provides type definitions.
 * 
 * @module global
 */

export {};

/**
 * Global type augmentations for browser APIs.
 * 
 * These declarations extend standard DOM interfaces to include:
 * - Vendor-prefixed properties (webkit, moz, ms)
 * - Non-standard but commonly available APIs
 * - Experimental browser features
 */
declare global {
  /**
   * Extended Window interface with vendor-specific and experimental properties.
   */
  interface Window {
    /** URL Pattern API (experimental) */
    URLPattern?: new (...args: unknown[]) => unknown;
    /** WebKit-prefixed OfflineAudioContext */
    webkitOfflineAudioContext?: typeof OfflineAudioContext;
    /** Legacy Web SQL Database API */
    openDatabase?(...args: unknown[]): void;
  }

  /**
   * Extended Element interface with vendor-specific fullscreen methods.
   */
  interface Element {
    /** WebKit-prefixed requestFullscreen method */
    webkitRequestFullscreen?: typeof Element.prototype.requestFullscreen;
  }

  /**
   * Extended Document interface with vendor-specific fullscreen properties and methods.
   */
  interface Document {
    /** Microsoft-prefixed fullscreen element property */
    msFullscreenElement?: typeof document.fullscreenElement;
    /** Mozilla-prefixed fullscreen element property */
    mozFullScreenElement?: typeof document.fullscreenElement;
    /** WebKit-prefixed fullscreen element property */
    webkitFullscreenElement?: typeof document.fullscreenElement;

    /** Microsoft-prefixed exit fullscreen method */
    msExitFullscreen?: typeof document.exitFullscreen;
    /** Mozilla-prefixed exit fullscreen method */
    mozCancelFullScreen?: typeof document.exitFullscreen;
    /** WebKit-prefixed exit fullscreen method */
    webkitExitFullscreen?: typeof document.exitFullscreen;
  }

  /**
   * Extended Navigator interface with non-standard and vendor-specific properties.
   */
  interface Navigator {
    /** Operating system CPU information (Gecko-specific) */
    oscpu?: string;
    /** User's preferred language (IE-specific) */
    userLanguage?: string;
    /** Browser language (IE-specific) */
    browserLanguage?: string;
    /** System language (IE-specific) */
    systemLanguage?: string;
    /** Approximate device memory in gigabytes */
    deviceMemory?: number;
    /** CPU class (IE-specific, deprecated) */
    cpuClass?: string;
    /** Maximum number of simultaneous touch points (IE-specific) */
    readonly msMaxTouchPoints?: number;
    /** Network connection information */
    connection?: {
      /** Event handler for connection type changes */
      ontypechange?: () => void;
    };
  }

  /**
   * Extended CSSStyleDeclaration interface with non-standard properties.
   */
  interface CSSStyleDeclaration {
    /** Non-standard zoom property */
    zoom: string;
    /** Text size adjustment property for mobile browsers */
    textSizeAdjust: string;
  }
}



