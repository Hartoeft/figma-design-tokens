import { format } from 'prettier';
import { CONFIG } from '../generate-design-tokens';
import { CssStyle, IEffect, IStyleObject, ITypographyStyles } from '../models/figma.model';
import { convertToRgba } from './convert-colors';
const autogeneratedText = `
    /////
    // This file is autogenerated from Figma!
    /////\n
`;

const formatName = (name: string): string => {
    // TODO: Someone who knows regex please fix this.
    // Look into return camelCase names for ts files and hyphens for css files.
    return name
        .replaceAll('–', '')
        .replaceAll('-', '')
        .replaceAll('/', '')
        .replaceAll(' ', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .toLowerCase();
};

export const colorTokenOutput = (colorTokens: IStyleObject[]) => {
    let content = '';
    const isCssOutput = CONFIG.fileExportType === 'css';

    if (isCssOutput) {
        content = formatColorOutputCss(colorTokens);
    } else {
        content = formatColorOutputTs(colorTokens);
    }

    return formattedOutput(content);
};

const formatColorOutputCss = (colorTokens: IStyleObject[]): string => {
    let content = `
    /*
    ${autogeneratedText}
    */`;

    colorTokens.forEach((token) => {
        content += `
            --${formatName(token.name)}: ${token.color};\n
        `;
    });

    const contentWrapper = `
        :root {
            ${content}
        }
    `;

    return contentWrapper;
};

const formatColorOutputTs = (colorTokens: IStyleObject[]): string => {
    let content = autogeneratedText;

    colorTokens.forEach((token) => {
        content += `
            /**
             * ${token.description ? `@description ${token.description}` : ''}
             * @example background-color: ${token.color};
             */
            export const ${formatName(token.name)} = '${token.color}';\n
        `;
    });

    return content;
};

export const typographyTokenOutput = (typographyTokens: ITypographyStyles[]) => {
    let content = '';
    const isCssOutput = CONFIG.fileExportType === 'css';
    if (isCssOutput) {
        content = formatTypographyOutputCss(typographyTokens);
    } else {
        content = formatTypographyOutputTs(typographyTokens);
    }

    return formattedOutput(content);
};

const formatTypographyOutputCss = (typographyTokens: ITypographyStyles[]) => {
    let content = `
    /*
    ${autogeneratedText}
    */\n\n`;

    for (const token of typographyTokens) {
        if (token.cssStyle) {
            content += `.${formatName(token.name)} {
                ${token.cssStyle}
            }\n\n`;
        }
    }

    return content;
};

const formatTypographyOutputTs = (typographyTokens: ITypographyStyles[]) => {
    let content = autogeneratedText;

    for (const token of typographyTokens) {
        let css = '';
        if (token.cssStyle && typeof token.cssStyle === 'object') {
            css = Object.keys(token.cssStyle)
                .map((key) => {
                    if (typeof token.cssStyle === 'string') {
                        return;
                    }

                    const style = token.cssStyle?.[key as keyof CssStyle];
                    if (style) {
                        return `${key}: '${style}'`;
                    }
                })
                .join(',\n');
        }
        content += `export const ${formatName(token.name)} = {
            ${css}
        };\n`;
    }

    return content;
};

export const formatEffectToken = (tokens: IEffect[]) => {
    const isCssOutput = CONFIG.fileExportType === 'css';
    let content = isCssOutput
        ? `/*
        ${autogeneratedText}
        */`
        : autogeneratedText;

    for (const token of tokens) {
        if (!token.effect) {
            continue;
        }

        content += effectTypeReturnValue(token);
    }

    const contentWrapper = `
    :root {
            ${content}
        }
    `;

    return isCssOutput ? formattedOutput(contentWrapper) : formattedOutput(content);
};

const effectTypeReturnValue = (token: IEffect) => {
    const { effect } = token;
    if (!effect) {
        return '';
    }

    let value: string | number = '';
    let exampleValue: string | number = '';
    switch (effect.type) {
        case 'BACKGROUND_BLUR':
            value = `blur(${effect.radius}px)`;
            exampleValue = 'backdrop-filter';
            break;

        case 'DROP_SHADOW':
            exampleValue = 'box-shadow';
            value = `${effect.offset?.x}px ${effect.offset?.y}px ${effect.radius}px ${
                effect.spread
            }px ${convertToRgba(effect.color)}`;
            break;

        case 'INNER_SHADOW':
            exampleValue = 'box-shadow';
            value = `inset ${effect.offset?.x}px ${effect.offset?.y}px ${effect.radius}px ${
                effect.spread
            }px #${convertToRgba(effect.color)}`;
            break;

        default:
            value = 'Error trying to format effect';
    }

    const isCssOutput = CONFIG.fileExportType === 'css';
    if (isCssOutput) {
        return `
       --${formatName(token.name)}: ${value};\n
        `;
    } else {
        return `
        /**
         * ${token.description ? `@description ${token.description}` : ''}
         * @example ${exampleValue}: ${value};
         */
        export const ${formatName(token.name)} = '${value}'\n\n
        `;
    }
};

const formattedOutput = (content: string) => {
    const isCssOutput = CONFIG.fileExportType === 'css';
    return format(content, {
        parser: isCssOutput ? 'css' : 'typescript',
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 4,
    });
};
