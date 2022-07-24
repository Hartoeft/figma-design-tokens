import { format } from 'prettier';
import { CssStyle, IEffect, IStyleObject, ITypographyStyles } from '../models/figma.model';
import { convertToRgba } from './convert-colors';
const autogeneratedText = `
    /////
    // This file is autogenerated from Figma!
    /////\n
`;

const formatName = (name: string): string => {
    // TODO: Look into better formatting
    const splitName = name.split('/').map((item, index) => {
        item = item.toLowerCase();
        if (index !== 0) {
            item = item.charAt(0).toUpperCase() + item.slice(1);
        }
        return item.trim();
    });

    return splitName
        .join('')
        .replaceAll('–', '')
        .replaceAll('-', '')
        .replaceAll('/', '')
        .replaceAll(' ', '')
        .replaceAll('(', '')
        .replaceAll(')', '');
};

export const colorTokenOutput = (colorTokens: IStyleObject[], isCssOutput: boolean) => {
    const content = isCssOutput ? formatColorOutputCss(colorTokens) : formatColorOutputTs(colorTokens);
    return formattedOutput(content, isCssOutput);
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

export const typographyTokenOutput = (typographyTokens: ITypographyStyles[], isCssOutput: boolean) => {
    const content = isCssOutput
        ? formatTypographyOutputCss(typographyTokens)
        : formatTypographyOutputTs(typographyTokens);

    return formattedOutput(content, isCssOutput);
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

export const formatEffectToken = (tokens: IEffect[], isCssOutput: boolean) => {
    let content = isCssOutput
        ? `/*
        ${autogeneratedText}
        */`
        : autogeneratedText;

    for (const token of tokens) {
        if (!token.effect) {
            continue;
        }

        content += effectTypeReturnValue(token, isCssOutput);
    }

    const contentWrapper = `
    :root {
            ${content}
        }
    `;

    return isCssOutput ? formattedOutput(contentWrapper, isCssOutput) : formattedOutput(content, isCssOutput);
};

const effectTypeReturnValue = (token: IEffect, isCssOutput: boolean) => {
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
            value = `${effect.offset?.x}px ${effect.offset?.y}px ${effect.radius}px ${effect.spread}px ${convertToRgba(
                effect.color,
            )}`;
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

const formattedOutput = (content: string, isCssOutput: boolean) => {
    return format(content, {
        parser: isCssOutput ? 'css' : 'typescript',
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 4,
    });
};
