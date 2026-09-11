export const SITE_ACCESS_COOKIE = "site_access";
export const SITE_ATTEMPTS_COOKIE = "site_attempts";
export const SITE_LOCKED_COOKIE = "site_locked";

export const MAX_ATTEMPTS = 5;

export const ACCESS_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days
export const ATTEMPTS_MAX_AGE_SEC = 60 * 60 * 24; // stale partial attempts reset after 24h
export const LOCK_MAX_AGE_SEC = 60 * 60 * 24; // lockout duration: 24h
