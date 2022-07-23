# figma-design-tokens

## How to use

- Add your figma API Token in a environment ".env" file

```.env
    FIGMA_TOKEN=ADD_YOUR_TOKEN_HERE
```

- Create a typescript file and add the following to the file
- Example ./src/design-tokens.ts

```ts
import { GenerateDesignTokens } from 'figma-design-tokens';

new GenerateDesignTokens({
    figmaFileId: 'YOU_FILE_ID',
    figmaTeamId: 'YOUR_TEAM_ID',
    nodesList: [
        { nodeId: '1:1', lookFor: 'colors' },
        { nodeId: '1:2', lookFor: 'typography' },
        { nodeId: '1:3', lookFor: 'effects' },
        { nodeId: '1:4', lookFor: 'effects' },
    ],

    fileExportType: 'ts', // 'ts' | 'css'
    distFolder: 'design/tokens' // defaults to dist'
});
```

- Open terminal and run following command in root folder `ts-node src/design-tokens.ts`
- Optional: You could add it under your scripts in package.json. e.g.

```json
"scripts": {
    "get-design-tokens": "ts-node src/design-tokens.ts"
}
```

### Output example

#### __Color ts__ file

Filename: _design-token-effects-1-1-colors.ts_

```ts
/**
 *
 * @example background-color: rgba(53, 79, 82, 1.00);
 */
export const green60 = 'rgba(53, 79, 82, 1.00)';

/**
 *
 * @example background-color: rgba(96, 123, 126, 1.00);
 */
export const green40 = 'rgba(96, 123, 126, 1.00)';
...
```

#### __Color CSS__ file

Filename: _design-token-effects-1-1-colors.css_

```css
:root {
    ...
    --blue: rgba(83, 109, 147, 1);

    --green: rgba(53, 79, 82, 1);

    --primary: rgba(96, 123, 126, 1);
    ...
}

...
```

#### __Typography TS__ file

Filename: _design-token-effects-1-2-typography.ts_

```ts
/**
 *
 * @example background-color: rgba(53, 79, 82, 1.00);
 */
export const green60 = 'rgba(53, 79, 82, 1.00)';

/**
 *
 * @example background-color: rgba(96, 123, 126, 1.00);
 */
export const green40 = 'rgba(96, 123, 126, 1.00)';
...
```

#### __Typography CSS__ file

Filename: _design-token-effects-1-2-typography.css_

```css
.body {
    font-family: 'Roboto Flex';
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0em;
    line-height: 1.375;
    text-transform: none;
}

.display1 {
    font-family: 'Roboto Flex';
    font-size: 40px;
    font-weight: 100;
    letter-spacing: 0em;
    line-height: 1.2;
    text-transform: none;
}

.display2 {
    font-family: 'Roboto Flex';
    font-size: 36px;
    font-weight: 100;
    letter-spacing: 0em;
    line-height: 1.19;
    text-transform: none;
}
...
```

#### __Effects ts__ file

Filename: _design-token-effects-1-3-effects.ts_

```ts
/**
 * @description Use this to blur an image
 * @example backdrop-filter: blur(5px);
 */
export const backgroundblur = 'blur(5px)';

/**
 *
 * @example box-shadow: 0px 9px 24px 6px rgba(0, 0, 0, 0.12);
 */
export const dropshadow = '0px 9px 24px 6px rgba(0, 0, 0, 0.12)';
...
```

#### __Effects CSS__ file

Filename: _design-token-effects-1-3-effects.css_

```css
:root {
    ...
    --backgroundblur: blur(5px);

    --dropshadowsmal: 0px 9px 24px 6px rgba(0, 0, 0, 0.12);
    ...
}
```

### Typescript interfaces

All typescript interfaces is not entirely accurate. I hope Figma, will add typings them self in the future.

### Prettier VS Code

Remember to add the following to your `.vscode/settings.json` file:

```json
    "prettier.configPath": ".prettierrc.json"
```

### Credits

Big thanks to my former workplace IMPACT COMMERCE <https://impactcommerce.com>, who gave me time to look into this.
