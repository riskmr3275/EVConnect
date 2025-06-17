import { clsx } from "clsx"

/**
 * Utility to conditionally join classNames
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
