import { Color, EffectType } from './figma.model';

export type BlurEffect = {
  radius: number;
};

export type DropShadowEffect = {
  type: 'DROP_SHADOW';
  visible: true;
  color: Color;
  blendMode: 'NORMAL';
  offset: {
    x: number;
    y: number;
  };
  radius: number;
  spread: number;
};

export type FindEffect = {
  type: EffectType;
  effect: {};
};
