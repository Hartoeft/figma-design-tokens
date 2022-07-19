# figma-design-tokens

## How to use

- Add your figma API Token in a environment ".env" file

```.env
    FIGMA_TOKEN=ADD_YOUR_TOKEN_HERE
```

- Example:

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

Will out something like this:

```ts
/**
 *
 * @example background-color: rgba(53, 79, 82, 1.00);
 */
export const greengreen60 = 'rgba(53, 79, 82, 1.00)';

/**
 *
 * @example background-color: rgba(96, 123, 126, 1.00);
 */
export const greengreen40 = 'rgba(96, 123, 126, 1.00)';
...
```

### Typescript interfaces

All typescript interfaces is not entirely accurate. I hope Figma, would a typings them self in the future.

### Prettier VS Code

Remember to add the following to your `.vscode/settings.json` file:

```json
    "prettier.configPath": ".prettierrc.json"
```

### Credits

Big thanks to my former workplace IMPACT COMMERCE <https://impactcommerce.com>, who gave me time to look into this.
