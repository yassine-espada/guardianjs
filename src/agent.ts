/**
 * @fileoverview Core Agent implementation for GuardianJS
 * 
 * This module contains the main agent logic that orchestrates browser signal collection,
 * anchor computation, and visitor ID generation. The agent follows a lazy initialization
 * pattern where signals are collected once and cached for subsequent calls.
 * 
 * @module agent
 */

import { version } from '../package.json';
import type { BrowserSignals } from './types';
import { computeBrowserSignals } from './computeBrowserSignals';
import { computeVisitorId } from './anchor';

/**
 * Configuration options for initializing the GuardianJS agent.
 * 
 * @interface LoadOptions
 * @property {boolean} [debug] - Whether to print debug information (anchor payload and timing) to the console.
 * 
 * @example
 * ```typescript
 * const agent = await load({ debug: true });
 * ```
 */
export interface LoadOptions {
  /**
   * Whether to print debug information (anchor payload and timing) to the console.
   */
  debug?: boolean;
}

/**
 * Options that can be passed to individual `get()` calls to override agent-level settings.
 * 
 * @interface GetOptions
 * @property {boolean} [debug] - Per-call debug override. If true, debug output is printed even when `load({ debug: false })`.
 * 
 * @example
 * ```typescript
 * const result = await agent.get({ debug: true });
 * ```
 */
export interface GetOptions {
  /**
   * Per-call debug override. If true, debug output is printed even when `load({ debug: false })`.
   */
  debug?: boolean;
}

/**
 * The complete result returned by the agent's `get()` method.
 * 
 * @interface GetResult
 * @property {string} visitorId - Anchor-based visitor identifier derived purely on the client.
 * @property {Record<string, unknown>} anchor - Structured anchor payload built from device- and browser-level signals.
 * @property {BrowserSignals} signals - Full browser signal bag as collected by the Guardian JS agent.
 * @property {string} version - GuardianJS library version.
 * 
 * @example
 * ```typescript
 * const result = await agent.get();
 * console.log('Visitor ID:', result.visitorId);
 * console.log('Anchor:', result.anchor);
 * console.log('Version:', result.version);
 * ```
 */
export interface GetResult {
  /**
   * Anchor-based visitor identifier derived purely on the client.
   */
  visitorId: string;
  /**
   * Structured anchor payload built from device- and browser-level signals.
   */
  anchor: Record<string, unknown>;
  /**
   * Full browser signal bag as collected by the Guardian JS agent.
   */
  signals: BrowserSignals;
  /**
   * GuardianJS library version.
   */
  version: string;
}

/**
 * The GuardianJS agent interface that provides methods to retrieve visitor identification data.
 * 
 * @interface Agent
 * 
 * @example
 * ```typescript
 * const agent = await load();
 * const result = await agent.get();
 * ```
 */
export interface Agent {
  /**
   * Collects browser signals (if not already collected), computes the anchor and visitorId,
   * and returns the full result.
   * 
   * @param {Readonly<GetOptions>} [options] - Optional configuration to override debug settings.
   * @returns {Promise<GetResult>} A promise that resolves to the complete identification result.
   * 
   * @example
   * ```typescript
   * const result = await agent.get({ debug: true });
   * ```
   */
  get(options?: Readonly<GetOptions>): Promise<GetResult>;
}

/**
 * Builds an Agent instance that lazily computes the visitorId from the collected signals.
 * 
 * This internal factory function creates an agent that defers signal collection until
 * the first `get()` call, allowing for efficient initialization without blocking.
 * 
 * @internal
 * @param {Promise<BrowserSignals>} signalsPromise - A promise that resolves to the collected browser signals.
 * @param {boolean} [debug] - Whether to enable debug output for all get() calls.
 * @returns {Agent} An agent instance with a get() method.
 */
function makeAgent(signalsPromise: Promise<BrowserSignals>, debug?: boolean): Agent {
  const creationTime = Date.now();

  return {
    async get(options?: Readonly<GetOptions>): Promise<GetResult> {
      const startTime = Date.now();
      const signals = await signalsPromise;
      const { anchor, visitorId } = computeVisitorId(signals);

      if (debug || options?.debug) {
        // eslint-disable-next-line no-console
        console.log(
          `[GuardianJS] Debug data\n` +
            `version: ${version}\n` +
            `userAgent: ${signals.userAgent}\n` +
            `timeBetweenLoadAndGet: ${startTime - creationTime}ms\n` +
            `visitorId: ${visitorId}\n` +
            `anchor: ${JSON.stringify(anchor, null, 2)}\n`,
        );
      }

      return {
        visitorId,
        anchor,
        signals,
        version,
      };
    },
  };
}

/**
 * Initializes GuardianJS and starts collecting browser signals.
 *
 * This is the main entry point for using GuardianJS Free. It begins asynchronous
 * collection of browser signals and returns an Agent instance that can be queried
 * for visitor identification data.
 * 
 * Unlike the closed-source Guardian Pro agent:
 *  - No API key is required.
 *  - No network calls are made.
 *  - The visitorId is computed entirely on the client from anchor data.
 * 
 * @param {Readonly<LoadOptions>} [options={}] - Configuration options for the agent.
 * @returns {Promise<Agent>} A promise that resolves to an initialized Agent instance.
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const agent = await load();
 * const result = await agent.get();
 * 
 * // With debug enabled
 * const debugAgent = await load({ debug: true });
 * const debugResult = await debugAgent.get();
 * ```
 * 
 * @public
 */
export async function load(options: Readonly<LoadOptions> = {}): Promise<Agent> {
  const { debug } = options;
  const signalsPromise = computeBrowserSignals();
  return makeAgent(signalsPromise, debug);
}


