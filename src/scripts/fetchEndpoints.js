// src/scripts/fetchEndpoints.js

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

/**
 * Fetches and processes endpoint files,
 * removes all imports except the two logo imports,
 * modifies the paths in those two imports,
 * removes TypeScript-specific syntax,
 * and writes the results into /src/utils/prodParasKusama.js and /src/utils/prodParasPolkadot.js
 */

async function fetchAndModify(fileInfo) {
  const { url, outputFileName } = fileInfo;

  try {
    // Fetch the TypeScript file from GitHub
    const response = await fetch(url);
    const code = await response.text();

    // Parse the TypeScript code into an AST
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    // Process the AST
    traverse(ast, {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value;

        // Keep only the two logo imports, adjust their paths
        if (sourceValue.includes('../ui/logos/chains/index.js')) {
          // Modify to your desired path
          path.node.source.value = '../assets/chains/index.ts';
        } else if (sourceValue.includes('../ui/logos/nodes/index.js')) {
          path.node.source.value = '../assets/nodes/index.ts';
        } else {
          // Remove other imports
          path.remove();
        }
      },
      TSInterfaceDeclaration(path) {
        // Remove TypeScript interface declarations
        path.remove();
      },
      TSTypeAliasDeclaration(path) {
        // Remove TypeScript type aliases
        path.remove();
      },
      ExportNamedDeclaration(path) {
        // Remove exports of TypeScript types
        if (t.isTSTypeAliasDeclaration(path.node.declaration) || t.isTSInterfaceDeclaration(path.node.declaration)) {
          path.remove();
        } else if (path.node.exportKind === 'type') {
          path.remove();
        }
      },
      // Remove type annotations
      TSTypeAnnotation(path) {
        path.remove();
      },
      // Remove `as` casts
      TSAsExpression(path) {
        path.replaceWith(path.node.expression);
      },
      // Remove TypeScript-specific imports (import type)
      ImportSpecifier(path) {
        if (path.node.importKind === 'type') {
          path.remove();
        }
      },
      // Remove `export type {...}`
      ExportSpecifier(path) {
        if (path.parent.exportKind === 'type') {
          path.remove();
        }
      },
    });

    // Generate the modified code
    const { code: modifiedCode } = generator(ast, {
      retainLines: true,
      comments: true,
    });

    // Define the output path
    const outputPath = path.resolve(__dirname, '..', 'utils', outputFileName);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the modified code to the output file
    fs.writeFileSync(outputPath, modifiedCode, 'utf8');

    console.log(`${outputFileName} has been written to ${outputPath}`);
  } catch (error) {
    console.error(`An error occurred while processing ${url}:`, error);
  }
}

async function run() {
  const filesToProcess = [
    {
      url: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/endpoints/productionRelayKusama.ts',
      outputFileName: 'prodParasKusama.js',
    },
    {
      url: 'https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/endpoints/productionRelayPolkadot.ts',
      outputFileName: 'prodParasPolkadot.js',
    },
  ];

  for (const fileInfo of filesToProcess) {
    await fetchAndModify(fileInfo);
  }
}

run();
