/**
 * Centralised configuration values for the COCO web platform.
 * All environment variables are read here — never scattered across components.
 */

/** Backend REST API base URL. Set NEXT_PUBLIC_API_URL in .env.local */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

/** Default number of trend days to request from the backend */
export const DEFAULT_TREND_DAYS = 7

/** Pagination default page size */
export const DEFAULT_PAGE_SIZE = 20
