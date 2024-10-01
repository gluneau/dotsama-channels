const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

async function fetchAndModify(fileInfo) {
  const { url, outputFileName } = fileInfo;

  try {
    const response = await fetch(url);
    const code = await response.text();

    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    traverse(ast, {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value;

        if (sourceValue.includes('../ui/logos/chains/index.js')) {
          path.node.source.value = '../assets/chains/index.ts';
        } else if (sourceValue.includes('../ui/logos/nodes/index.js')) {
          path.node.source.value = '../assets/nodes/index.ts';
        } else {
          path.remove();
        }
      },
      TSInterfaceDeclaration(path) {
        path.remove();
      },
      TSTypeAliasDeclaration(path) {
        path.remove();
      },
      ExportNamedDeclaration(path) {
        if (t.isTSTypeAliasDeclaration(path.node.declaration) || t.isTSInterfaceDeclaration(path.node.declaration)) {
          path.remove();
        } else if (path.node.exportKind === 'type') {
          path.remove();
        } else if (t.isVariableDeclaration(path.node.declaration)) {
          const declarationName = path.node.declaration.declarations[0].id.name;
          if (declarationName === 'prodRelayKusama' || declarationName === 'prodRelayPolkadot') {
            path.remove();
          }
        }
      },
      TSTypeAnnotation(path) {
        path.remove();
      },
      TSAsExpression(path) {
        path.replaceWith(path.node.expression);
      },
      ImportSpecifier(path) {
        if (path.node.importKind === 'type') {
          path.remove();
        }
      },
      ExportSpecifier(path) {
        if (path.parent.exportKind === 'type') {
          path.remove();
        }
      }
    });

    const { code: modifiedCode } = generator(ast, {
      retainLines: true,
      comments: true,
    });

    const outputPath = path.resolve(__dirname, '..', 'utils', outputFileName);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

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
