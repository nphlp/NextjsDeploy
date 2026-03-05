/**
 * Height relative to font-size
 * -> 16px x 4rem = 64px
 */
export const HEADER_HEIGHT = 4;

/**
 * Debug layout colors
 * -> Use `/layout` page to see the colored layout
 */
export const DEBUG_LAYOUT = false;

/**
 * Enable server-side rendering of theme class on HTML element
 * - `true`: prevent theme flashing on initial load, but make HTML component dynamic, that subsequently disable static optimization
 * - `false`: keep static HTML component, but may have a short theme flashing on initial load
 */
export const SSR_THEME = false;
