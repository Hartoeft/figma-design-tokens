import { Child, Effect, TypeStyle } from '../models/figma.model';
import { convertToRgba } from './convert-colors';

// TODO: All find function are basically doing the same thing. They are only checking for different types.
// Maybe we can refactor them to a single function.

export const findTypographyTokens = (nodeId: string, children: Child[]): TypeStyle | undefined => {
  let typographyValue: TypeStyle | undefined = undefined;
  let found: boolean = false;

  const getTypographyTokens = (nodeId: string, children: Child[]) => {
    for (const child of children) {
      if (child.styles?.text === nodeId && child.style) {
        typographyValue = child.style;
        found = true;
        break;
      } else {
        if (Array.isArray(child.children)) {
          getTypographyTokens(nodeId, child.children);

          if (found) {
            break;
          }
        }
      }
    }
  };

  getTypographyTokens(nodeId, children);

  return typographyValue;
};

export const findColorTokens = (nodeId: string, children: Child[]): string | undefined => {
  let colorValue: string | undefined = undefined;
  let found: boolean = false;

  const getColorTokens = (nodeId: string, children: Child[]) => {
    for (const child of children) {
      if (child.styles?.fill === nodeId && child.fills?.[0]) {
        const rgba = convertToRgba(child.fills[0].color);
        colorValue = rgba;
        found = true;
        break;
      } else {
        if (Array.isArray(child.children)) {
          getColorTokens(nodeId, child.children);

          if (found) {
            break;
          }
        }
      }
    }
  };

  getColorTokens(nodeId, children);

  return colorValue;
};

/**
 * Get a tokens effect value, and break out of recursive loops early if found.
 */
export const findEffectTokens = (nodeId: string, children: Child[]): Effect | undefined => {
  let effectValue: undefined | Effect = undefined;
  let found: boolean = false;

  const getEffects = (nodeId: string, children: Child[]) => {
    for (const child of children) {
      if (child.styles?.effect === nodeId && child.effects?.[0]?.type) {
        effectValue = child.effects[0];
        found = true;
        break;
      } else {
        if (Array.isArray(child.children)) {
          getEffects(nodeId, child.children);

          if (found) {
            break;
          }
        }
      }
    }
  };

  getEffects(nodeId, children);

  return effectValue;
};
