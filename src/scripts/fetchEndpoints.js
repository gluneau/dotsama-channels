// fetchProdParasKusama.js

const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

/**
 * Fetches the productionRelayKusama.ts file,
 * extracts the prodParasKusama array,
 * removes imports and TypeScript syntax,
 * and writes it into /src/utils/prodParasKusama.js
 */
async function fetchAndExtract() {
  const url =
    "https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps-config/src/endpoints/productionRelayKusama.ts";

  try {
    // Fetch the TypeScript file from GitHub
    const response = await fetch(url);
    const code = await response.text();

    // Use Babel to transpile TypeScript to JavaScript
    const transformed = babel.transformSync(code, {
      filename: "productionRelayKusama.ts",
      presets: ["@babel/preset-typescript"],
      plugins: [
        // Plugin to remove imports
        function removeImports() {
          return {
            visitor: {
              ImportDeclaration(path) {
                path.remove();
              },
              ExportNamedDeclaration(path) {
                // Keep only the prodParasKusama export
                const declaration = path.node.declaration;
                if (
                  declaration &&
                  declaration.type === "VariableDeclaration" &&
                  declaration.declarations[0].id.name === "prodParasKusama"
                ) {
                  // Remove the 'export' keyword
                  path.replaceWith(declaration);
                } else {
                  path.remove();
                }
              },
            },
          };
        },
      ],
      comments: true,
    });

    const transformedCode = transformed.code;

    // Extract the license comment (first comment block)
    const licenseCommentMatch = transformedCode.match(/\/\*[\s\S]*?\*\//);
    const licenseComment = licenseCommentMatch ? licenseCommentMatch[0] : "";

    // Extract the prodParasKusama array declaration
    const arrayMatch = transformedCode.match(
      /const prodParasKusama = \[[\s\S]*?\];/
    );
    if (!arrayMatch) {
      throw new Error(
        "prodParasKusama array not found in the transformed code."
      );
    }
    const arrayCode = arrayMatch[0];

    // Construct the final output
    const finalOutput = `${licenseComment}

${arrayCode}
`;

    // Define the output path
    const outputPath = path.resolve(
      __dirname,
      "src",
      "utils",
      "prodParasKusama.js"
    );

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the new file
    fs.writeFileSync(outputPath, finalOutput, "utf8");

    console.log(`prodParasKusama array has been written to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

fetchAndExtract();
