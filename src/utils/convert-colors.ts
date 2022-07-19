import { Color } from '../models/figma.model';

export const convertToRgba = (color: Color) => {
    const r = Math.round(color.r * 255)
        .toFixed(0)
        .toString();
    const g = Math.round(color.g * 255)
        .toFixed(0)
        .toString();
    const b = Math.round(color.b * 255)
        .toFixed(0)
        .toString();
    const a = color.a.toFixed(2).toString();

    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

    return rgba;
};

// convert rgba to hexcode
export const convertToHex = (color: string) => {
    const data = color.match(/\d+/g);
    if (!data) {
        return '';
    }
    const [r, g, b] = data.map(Number);
    const hex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    return hex;
};
