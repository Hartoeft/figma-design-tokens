/**
 * @param maxSize - Add value in pixels, consider this as the desktop size
 * @param minSize - Add value in pixels, consider this a mobile size
 * @returns {string} - Returns either clamp value or a rem based value.
 * @description
 * - This function is used to calculate the clamp value based on the breakpoints.
 * - If the value is greater than the desktopSize, then it will return the desktopSize value.
 * - We use REM values to support browser accessibility.
 * @example
 * getFluidValue(20, 18); // returns 'clamp(1.8rem, 1.3888888888888888vw, 2.0rem);';
 * getFluidValue(20); // returns '2.0rem';
 */
export const getFluidValue = (contentMaxWidth: number, maxSize: number, minSize?: number): string => {
    const globalRemValue = 10;
    if (!minSize) {
        return `${maxSize / globalRemValue}rem`;
    }

    const fluidValue = (maxSize / contentMaxWidth) * 100; // Calculate the fluid value, until our max content width.
    const min = `${minSize / globalRemValue}rem`;
    const val = `${fluidValue}vw`;
    const max = `${maxSize / globalRemValue}rem`;

    return `clamp(${min}, ${val}, ${max})`;
};
