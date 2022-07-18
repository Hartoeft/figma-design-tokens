export interface CssStyle {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
    lineHeight?: string;
    textTransform?: string;
    letterSpacing?: string;
}

export interface ITypographyStyles {
    name: string;
    cssStyle?: CssStyle | string;
    nodeId?: string;
    description?: string;
}

export interface IStyleObject {
    name: string;
    color: string;
    nodeId?: string;
    description?: string;
}
export interface IEffect {
    name: string;
    nodeId: string;
    description?: string;
    effect?: Effect;
}

export interface IColor {
    blendMode: string;
    type: 'SOLID';
    color: Color;
}

export interface AbsoluteBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Constraints {
    vertical: string;
    horizontal: string;
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface Fill {
    blendMode: string;
    type: string;
    color: Color;
    visible?: boolean;
}

export interface Styles {
    fill?: string;
    text?: string;
    effect?: string;
}

export interface BackgroundColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface Background {
    blendMode: string;
    visible: boolean;
    type: string;
    color: Color;
}

export interface Constraint {
    type: string;
    value: number;
}

export interface ExportSetting {
    suffix: string;
    format: string;
    constraint: Constraint;
}

export interface TypeStyle {
    fontFamily: string;
    fontPostScriptName: string;
    fontWeight: number;
    textCase: string;
    fontSize: number;
    textAlignHorizontal: string;
    textAlignVertical: string;
    letterSpacing: number;
    lineHeightPx: number;
    lineHeightPercent: number;
    lineHeightUnit: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StyleOverrideTable {}

export type EffectType = 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';

export interface Effect {
    type: EffectType;
    visible: boolean;
    radius: number;
    color: Color;
    blendMode?: string;
    offset?: {
        x: 0.0;
        y: 40.0;
    };
    spread?: number;
    showShadowBehindNode?: boolean;
}

export interface Child {
    id: string;
    name: string;
    type: string;
    blendMode: string;
    children: Child[];
    absoluteBoundingBox: AbsoluteBoundingBox;
    constraints: Constraints;
    clipsContent: boolean;
    background: any[];
    fills: Fill[];
    strokes: any[];
    strokeWeight: number;
    strokeAlign: string;
    backgroundColor: BackgroundColor;
    layoutMode: string;
    itemSpacing: number;
    effects: Effect[];
    characters: string;
    style?: TypeStyle;
    styles: Styles;
    layoutVersion?: number;
    characterStyleOverrides: any[];
    styleOverrideTable: StyleOverrideTable;
    lineTypes: string[];
    lineIndentations: number[];
}

export interface FigmaDocument {
    id: string;
    name: string;
    type: string;
    blendMode: string;
    children: Child[];
    absoluteBoundingBox: AbsoluteBoundingBox;
    constraints: Constraints;
    clipsContent: boolean;
    background: Background[];
    fills: Fill[];
    strokes: any[];
    strokeWeight: number;
    strokeAlign: string;
    backgroundColor: BackgroundColor;
    effects: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComponentSets {}

export interface TEST {
    key: string;
    name: string;
    styleType: string;
    description: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Nodes {
    [key: string]: any;
}

export interface FigmaFileModel {
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    role: string;
    editorType: string;
    linkAccess: string;
    nodes: Nodes;
}
