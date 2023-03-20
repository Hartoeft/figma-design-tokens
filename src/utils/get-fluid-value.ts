/**
 * @param contentMaxWidth - Your max content container width in pixels
 * @param maxSize - Add value in pixels, consider this as the desktop size
 * @param minSize - Add value in pixels, consider this a mobile size
 * @param baseFontSize - Add value in pixels, consider this as the base font size. Usually defined in html or body tag.
 * @returns {string} - Returns either clamp value or a rem based value.
 * @description
 * - This function is used to calculate the clamp value based on the breakpoints.
 * - If the value is greater than the desktopSize, then it will return the desktopSize value.
 * - We use REM values to support browser accessibility.
 */
export const getFluidValue = (
  contentMaxWidth: number,
  maxSize: number,
  minSize?: number,
  baseFontSize = 16,
): string => {
  if (!minSize) {
    return `${maxSize / baseFontSize}rem`;
  }

  const fluidValue = (maxSize / contentMaxWidth) * 100; // Calculate the fluid value, until our max content width.
  const min = `${minSize / baseFontSize}rem`;
  const val = `${fluidValue}vw`;
  const max = `${maxSize / baseFontSize}rem`;

  return `clamp(${min}, ${val}, ${max})`;
};
