import { format } from 'prettier';
import { CssStyle, IEffect, IStyleObject, ITypographyStyles } from '../models/figma.model';
import { convertToRgba } from './convert-colors';
import { IFormatType } from '../models/find-tokens.model';
const autogeneratedText = `
    ///
    // This file is autogenerated by "figma-design-tokens"!
    // Last updated: ${new Date().toLocaleString()}
    // If you edit this file, it will be overwritten, next time you run the command.
    ///\n
`;

const formatName = (name: string): string => {
  // TODO: Look into better formatting
  const splitName = name
    .toLowerCase()
    .split('/')
    .map((item, index) => {
      item = item.toLowerCase();
      if (index !== 0) {
        item = item.charAt(0).toUpperCase() + item.slice(1);
      }
      return item.trim();
    });

  return splitName.join('').replaceAll(/[-/() ]/g, '');
};

export const colorTokenOutput = (
  colorTokens: IStyleObject[],
  isCssOutput: boolean,
  formatAs?: string,
  type?: IFormatType,
) => {
  const content = isCssOutput ? formatColorOutputCss(colorTokens) : formatColorOutputTs(colorTokens, formatAs, type);
  return formattedOutput(content, isCssOutput);
};

const formatColorOutputCss = (colorTokens: IStyleObject[]): string => {
  const content = colorTokens.map((token) => `--${formatName(token.name)}: ${token.color};`).join('\n');
  return `:root {\n${content}\n}`;
};

const formatColorOutputTs = (colorTokens: IStyleObject[], formatAs?: string, type?: IFormatType): string => {
  let content = autogeneratedText;

  if (formatAs === 'tailwind') {
    const groupedColors = colorTokens.reduce((acc, token) => {
      const nameLevels = token.name.toLowerCase().split('/');
      let group: any = acc;

      nameLevels.forEach((name, i) => {
        const keyName = formatName(name);
        const levelName = keyName === 'default' ? 'DEFAULT' : keyName;

        if (!group[levelName]) {
          group[levelName] = {};
        }

        if (i === nameLevels.length - 1) {
          group[levelName] = token.color;
        } else {
          group = group[levelName];
        }
      });

      return acc;
    }, {});

    if (type === 'module') {
      content += `
        module.exports = ${JSON.stringify(groupedColors)};
      `;
    } else {
      content += `
        export const colorTokens = ${JSON.stringify(groupedColors)};
      `;
    }
  } else {
    colorTokens.forEach((token) => {
      const name = formatName(token.name);

      content += `
      /**
       * ${token.description ? `@description ${token.description}` : ''}
       * @example backgroundColor: ${name};
       */
      export const ${name} = '${token.color}';
    `;
    });
  }
  return content;
};

export const typographyTokenOutput = (
  typographyTokens: ITypographyStyles[],
  isCssOutput: boolean,
  formatAs?: string,
  formatType: IFormatType = 'object',
) => {
  let content = '';
  if (isCssOutput) {
    content = formatTypographyOutputCss(typographyTokens);
  } else if (!isCssOutput && formatAs === 'tailwind') {
    content = formatTypographyOutputTailwind(typographyTokens, formatType);
  } else if (!isCssOutput && formatAs !== 'tailwind') {
    content = formatTypographyOutputTs(typographyTokens);
  }

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

const formatTypographyOutputTailwind = (typographyTokens: ITypographyStyles[], type: IFormatType) => {
  let content = autogeneratedText;
  let contentWrapperTailwind = ``;

  for (const token of typographyTokens) {
    let css = '';
    if (token.cssStyle && typeof token.cssStyle === 'object') {
      css = `
        ['${token.cssStyle?.fontSize}', {
          lineHeight: '${token.cssStyle?.lineHeight}',
          letterSpacing: '${token.cssStyle?.letterSpacing}',
          fontWeight: ${token.cssStyle?.fontWeight},
        }]`;

      contentWrapperTailwind += `
        // FontFamily is: "${token.cssStyle.fontFamily}"
        ${formatName(token.name)}: ${css},\n
      `;
    }
  }

  if (type === 'module') {
    content += `
      module.exports = {
        ${contentWrapperTailwind}
      };
    `;
  } else {
    content += `
      export const typographyTokens = {
        ${contentWrapperTailwind}
      } satisfies Record<
        string,
        [
          fontSize: string,
          configuration: Partial<{
            lineHeight: string;
            letterSpacing: string;
            fontWeight: string | number;
          }>,
        ]
      >;
    `;
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
      exampleValue = 'backdropFilter';
      break;

    case 'DROP_SHADOW':
      exampleValue = 'boxShadow';
      value = `${effect.offset?.x || 0}px ${effect.offset?.y || 0}px ${effect.radius || 0}px ${
        effect.spread || 0
      }px ${convertToRgba(effect.color)}`;
      break;

    case 'INNER_SHADOW':
      exampleValue = 'boxShadow';
      value = `inset ${effect.offset?.x || 0}px ${effect.offset?.y || 0}px ${effect.radius || 0}px ${
        effect.spread
      }px ${convertToRgba(effect.color)}`;
      break;

    default:
      value = 'Error trying to format effect';
  }

  const name = formatName(token.name);
  if (isCssOutput) {
    return `--${name}: ${value};\n`;
  } else {
    return `
        /**
         * ${token.description ? `@description ${token.description}` : ''}
         * @example ${exampleValue}: ${name};
         */
        export const ${name} = '${value}'\n\n
        `;
  }
};

const formattedOutput = (content: string, isCssOutput: boolean) => {
  return format(content, {
    parser: isCssOutput ? 'css' : 'typescript',
    singleQuote: true,
    semi: true,
    useTabs: false,
    tabWidth: 2,
  });
};
