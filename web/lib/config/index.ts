/**
 * Centralised configuration values for the COCO web platform.
 * All environment variables are read here — never scattered across components.
 */

/** Server-only backend URL; browser calls use the same-origin proxy. */
export const API_URL = process.env.COCO_API_URL ?? ''

/** Default number of trend days to request from the backend */
export const DEFAULT_TREND_DAYS = 7

/** Pagination default page size */
export const DEFAULT_PAGE_SIZE = 20
