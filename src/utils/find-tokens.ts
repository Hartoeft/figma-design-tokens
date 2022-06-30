import { Child, TypeStyle } from '../models/figma.model';
import { convertToRgba } from './convert-colors';

export class FindTokens {
    color?: string;
    typography?: TypeStyle;

    constructor() {
        this.color = undefined;
        this.typography = undefined;
    }

    getTypographyTokens = (nodeId: string, children: Child[]) => {
        for (const child of children) {
            if (child.styles?.text === nodeId && child.style) {
                this.typography = child.style;
                break;
            } else if (Array.isArray(child.children)) {
                this.getTypographyTokens(nodeId, child.children);
            }
        }
    };

    getColorTokens = (nodeId: string, children: Child[]) => {
        for (const child of children) {
            if (child.styles?.fill === nodeId && child.fills?.[0]) {
                this.color = convertToRgba(child.fills[0]);
                break;
            } else if (Array.isArray(child.children)) {
                this.getColorTokens(nodeId, child.children);
            }
        }
    };
}
