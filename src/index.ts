/**
 * @fileoverview GuardianJS Free - Open-source browser fingerprinting library
 * 
 * GuardianJS Free is a purely client-side browser fingerprinting library that computes
 * a stable anchor-based visitor identifier without requiring API keys or backend calls.
 * 
 * This module serves as the main entry point for the library, exposing the core
 * `load` function and all public types and utilities.
 * 
 * @module @guardianstack/guardianjs-free
 * @author GuardianStack
 * @license MIT
 * 
 * @example
 * ```typescript
 * import GuardianJS from '@guardianstack/guardianjs-free';
 * 
 * // Initialize the agent
 * const agentPromise = GuardianJS.load({ debug: false });
 * 
 * // Get the visitor identifier
 * const agent = await agentPromise;
 * const result = await agent.get();
 * console.log('Visitor ID:', result.visitorId);
 * ```
 */

import { load } from './agent';
export { load } from './agent';
export type { Agent, GetOptions, GetResult, LoadOptions } from './agent';
export type { BrowserSignals } from './types';
export { computeAnchor, computeVisitorId, type AnchorPayload } from './anchor';

/**
 * Default export for CommonJS and ES module interoperability.
 * Allows usage as: `import GuardianJS from '@guardianstack/guardianjs-free'`
 * 
 * @default
 */
export default { load };


